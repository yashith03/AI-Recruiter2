// app/api/ai-model/route.jsx

import { QUESTIONS_PROMPT } from "@/services/Constants";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

// -------------------------------------------
// Helper: Extract clean JSON from model output
// -------------------------------------------
function extractJSON(output) {
  try {
    // 1. Remove common markdown artifacts
    let cleaned = output
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // 2. Find the first '{' and last '}' to isolate the JSON object
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start === -1 || end === -1 || end < start) {
      console.warn("No JSON object boundaries found in AI output.");
      return {};
    }

    cleaned = cleaned.substring(start, end + 1);

    const parsed = JSON.parse(cleaned);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch (err) {
    console.error("extractJSON failed to parse:", err.message);
    return {};
  }
}


// -------------------------------------------
// POST handler
// -------------------------------------------
export async function POST(req) {
  try {
    let body;

    try {
      body = await req.json();
    } catch (err) {
      console.error("Request JSON parse error:", err);
      return NextResponse.json(
        { error: "Unexpected error parsing request" },
        { status: 500 }
      );
    }
    console.log("AI API REQUEST BODY:", body);


const { jobPosition, jobDescription, duration, type } = body || {};

    if (!jobPosition || !jobDescription || !duration || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Build prompt correctly - use replaceAll to catch all instances
    const FINAL_PROMPT = QUESTIONS_PROMPT
      .replaceAll("{{jobTitle}}", jobPosition)
      .replaceAll("{{jobDescription}}", jobDescription)
      .replaceAll("{{duration}}", duration)
      .replaceAll("{{type}}", Array.isArray(type) ? type.join(", ") : type);

    console.log("FINAL PROMPT SENT TO AI:\n", FINAL_PROMPT);


    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const models = [
      "google/gemini-2.0-flash-exp:free",
      "google/gemma-2-9b-it:free",
      "meta-llama/llama-3.2-3b-instruct:free",
      "mistralai/mistral-small-24b-instruct-2501:free",
      "qwen/qwen-2.5-7b-instruct:free",
    ];

    let completion = null;

    for (let i = 0; i < models.length; i++) {
      const model = models[i];
      try {
        // Add small delay between models to avoid 429 pressure
        if (i > 0) await new Promise((res) => setTimeout(res, 1000));

        console.log("Trying model:", model);
        completion = await openai.chat.completions.create({
          model,
          messages: [{ role: "user", content: FINAL_PROMPT }],
          max_tokens: 1000,
        });

        const rawContent = String(completion.choices?.[0]?.message?.content || "");
        console.log(`RAW AI RESPONSE (${model}) preview:`, rawContent.slice(0, 100) + "...");

        const parsed = extractJSON(rawContent);
        const questions = Array.isArray(parsed.interviewQuestions) ? parsed.interviewQuestions : [];

        if (questions.length > 0) {
          console.log(`Model ${model} succeeded with ${questions.length} questions.`);
          return NextResponse.json({ interviewQuestions: questions }, { status: 200 });
        } else {
          console.warn(`Model ${model} returned zero questions or invalid JSON. Trying next...`);
          completion = null; // Reset to continue loop
        }
      } catch (err) {
        console.error(`Model failed (${model}):`, err?.status || err?.message);
        if (err.status === 429) {
          await new Promise((res) => setTimeout(res, 500));
        }
      }
    }

    return NextResponse.json(
      { error: "All FREE models failed, rate-limited, or returned invalid data" },
      { status: 500 }
    );


  } catch (err) {
    console.error("AI MODEL API ERROR:", err);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
