// app/api/ai-model/route.jsx

import { QUESTIONS_PROMPT } from "@/services/Constants";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

// -------------------------------------------
// Helper: Extract clean JSON from model output
// -------------------------------------------
function extractJSON(output) {
  try {
    let cleaned = output
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const firstBrace = cleaned.indexOf("{");
    if (firstBrace !== -1) {
      cleaned = cleaned.slice(firstBrace);
    }

    const lastBrace = cleaned.lastIndexOf("}");
    if (lastBrace !== -1) {
      cleaned = cleaned.slice(0, lastBrace + 1);
    }

const parsed = JSON.parse(cleaned);
return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch (err) {
    console.error("JSON parse failed:", err);
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

    // Build prompt correctly
    const FINAL_PROMPT = QUESTIONS_PROMPT
      .replace("{{jobTitle}}", jobPosition)
      .replace("{{jobDescription}}", jobDescription)
      .replace("{{duration}}", duration)
      .replace("{{type}}", Array.isArray(type) ? type.join(", ") : type);

    console.log("FINAL PROMPT SENT TO AI:\n", FINAL_PROMPT);


    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const models = [
      "openai/gpt-oss-20b:free",
      "nvidia/nemotron-nano-9b-v2:free",
      "kwaipilot/kat-coder-pro-v1:free",
      "nvidia/nemotron-nano-12b-vl:free",
      "x-ai/grok-4.1-fast:free",
    ];

    let completion = null;

    for (const model of models) {
      try {
        console.log("Trying model:", model);
        completion = await openai.chat.completions.create({
          model,
messages: [
  {
    role: "user",
    content: FINAL_PROMPT,
  },
],

          max_tokens: 1000,
        });

        break;
      } catch (err) {
        console.error(`Model failed (${model}):`, err?.status || err?.message);
        if (err.status === 429) {
          await new Promise((res) => setTimeout(res, 500));
          continue;
        }
      }
    }

    if (!completion) {
      return NextResponse.json(
        { error: "All FREE models failed or rate-limited" },
        { status: 500 }
      );
    }

const rawContent = String(
  completion.choices?.[0]?.message?.content || ""
);
    console.log("RAW AI RESPONSE:", rawContent);

    const parsed = extractJSON(rawContent);
    console.log("PARSED JSON:", parsed);


const questions = Array.isArray(parsed.interviewQuestions)
  ? parsed.interviewQuestions
  : [];
console.log("QUESTION COUNT:", questions.length);

return NextResponse.json(
  { interviewQuestions: questions },
  { status: 200 }
  
);


  } catch (err) {
    console.error("AI MODEL API ERROR:", err);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
