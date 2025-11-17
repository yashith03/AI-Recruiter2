// app/api/ai-model/route.jsx
import { QUESTIONS_PROMPT } from "@/services/Constants";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

export async function POST(req) {
  try {
    const { jobPosition, jobDescription, duration, type } = await req.json();

    // Ensure `type` is a string (frontend may send an array)
    const typeString = Array.isArray(type) ? type.join(", ") : (type || "");

    const FINAL_PROMPT = QUESTIONS_PROMPT
      .replace("{{jobTitle}}", jobPosition)
      .replace("{{jobDescription}}", jobDescription)
      .replace("{{duration}}", duration)
      .replace("{{type}}", typeString);

    console.log(" Prompt sent to model:\n", FINAL_PROMPT);

    // ✅ Initialize OpenRouter client
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    // ✅ Fallback chain — from newest → safest
    const models = [
      "google/gemma-3-12b-it:free",          //  primary: fast + accurate
      "google/gemini-2.0-flash-exp:free",   //  fallback: large context
      "mistralai/mistral-7b-instruct:free", //  backup: reliable baseline
    ];

    let completion = null;

    for (const model of models) {
      try {
        console.log(` Trying model: ${model}`);
        completion = await openai.chat.completions.create({
          model,
          messages: [{ role: "user", content: FINAL_PROMPT }],
          response_format: "json",
        });
        console.log(` Success with model: ${model}`);
        break; // stop after first success
      } catch (err) {
        console.warn(` Model ${model} failed: ${err.message}`);
        if (err.status === 429) {
          console.log(" Rate limited, waiting 3 seconds before next model...");
          await new Promise((r) => setTimeout(r, 3000));
          continue; // try next model
        }
        // For non-rate errors, move to next model too
        continue;
      }
    }

    if (!completion) {
      throw new Error("All models failed or rate-limited.");
    }

    const message = completion.choices?.[0]?.message?.content || "No response.";
    console.log(" Raw AI Output:", message);

    //  Try to extract clean JSON if provided
    let parsedOutput;
    try {
      const jsonBlock = message.match(/```json([\s\S]*?)```/)?.[1] || "{}";
      parsedOutput = JSON.parse(jsonBlock);
    } catch {
      parsedOutput = { interviewQuestions: [] };
    }

    // Return both the raw message content and the parsed JSON for compatibility
    return NextResponse.json(
      { content: message, result: parsedOutput },
      { status: 200 }
    );
  } catch (error) {
    console.error(" AI Model API Error:", error?.response?.data || error.message);
    return NextResponse.json(
      {
        error:
          error?.response?.data ||
          error?.message ||
          "Failed to generate interview questions. Please try again later.",
      },
      { status: error?.status || 500 }
    );
  }
}
