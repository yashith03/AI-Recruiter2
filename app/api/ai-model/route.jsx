// app/api/ai-model/route.js

import { QUESTIONS_PROMPT } from "@/services/Constants";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

// -------------------------------------------
// Helper: Extract clean JSON from model output
// -------------------------------------------
function extractJSON(output) {
  if (!output || typeof output !== "string") return {};

  // Remove ```json and ``` wrappers
  let cleaned = output
    .replace(/```json/i, "")
    .replace(/```/g, "")
    .trim();

  // Find first {
  const firstBrace = cleaned.indexOf("{");
  if (firstBrace > 0) cleaned = cleaned.slice(firstBrace);

  // Find last }
  const lastBrace = cleaned.lastIndexOf("}");
  if (lastBrace > 0) cleaned = cleaned.slice(0, lastBrace + 1);

  try {
    const parsed = JSON.parse(cleaned);

    // Enforce expected structure ONLY when JSON exists
    if (!parsed.interviewQuestions || !Array.isArray(parsed.interviewQuestions)) {
      parsed.interviewQuestions = [];
    }

    return parsed;

  } catch (err) {
    console.log("JSON parse failed. Returning empty object:", cleaned);
    return { interviewQuestions: [] };
  }
}

export async function POST(req) {
  try {
    const { jobPosition, jobDescription, duration, type } = await req.json();

    const typeString = Array.isArray(type) ? type.join(", ") : type || "";

    const typeGuide =
      typeString.toLowerCase().includes("behavioral")
        ? "Focus on real-world scenarios, past experiences, and decision-making."
        : "";

    const FINAL_PROMPT =
      QUESTIONS_PROMPT
        .replace("{{jobTitle}}", jobPosition)
        .replace("{{jobDescription}}", jobDescription)
        .replace("{{duration}}", duration)
        .replace("{{type}}", typeString)
      + `\n\n${typeGuide}`;

    console.log("Prompt sent:\n", FINAL_PROMPT);

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const models = [
      "openai/gpt-oss-20b:free",
      "nvidia/nemotron-nano-9b-v2:free",
      "kwaipilot/kat-coder-pro-v1:free",
      "nvidia/nemotron-nano-12b-vl:free",
      "x-ai/grok-4.1-fast:free"
    ];

    let completion = null;

    for (const model of models) {
      try {
        console.log("Trying:", model);

        completion = await openai.chat.completions.create({
          model,
          messages: [
            {
              role: "system",
              content: "You must return valid JSON only. Format: {\"interviewQuestions\": [...]}",
            },
            {
              role: "user",
              content: FINAL_PROMPT,
            },
          ],
          max_tokens: 2000,
        });

        console.log("SUCCESS:", model);
        break;

      } catch (err) {
        console.log("FAILED:", model, err.message);

        if (err.status === 429) {
          await new Promise((res) => setTimeout(res, 1500));
        }
      }
    }

    if (!completion) {
      return NextResponse.json(
        { error: "All FREE models failed or rate-limited." },
        { status: 500 }
      );
    }

    const raw = completion.choices?.[0]?.message?.content || "";
    console.log("RAW OUTPUT:", raw);

    // -------------------------------------------
    // NEW FIX: If output has NO JSON at all → return {}
    // -------------------------------------------
    let parsed;
    if (!raw.includes("{")) {
      parsed = {}; // This matches your failing test expectation
    } else {
      parsed = extractJSON(raw);
    }

    return NextResponse.json(
      { content: raw, result: parsed },
      { status: 200 }
    );

  } catch (e) {
    console.error("ERROR:", e.message);

    return NextResponse.json(
      { error: `Unexpected error: ${e.message}` },
      { status: 500 }
    );
  }
}
