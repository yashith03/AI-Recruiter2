// app/api/ai-model/route.js

import { QUESTIONS_PROMPT } from "@/services/Constants";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

// -------------------------------------------
// Helper: Extract clean JSON from model output
// -------------------------------------------
function extractJSON(output) {
  if (!output || typeof output !== "string") {
    return {};
  }

  let cleaned = output
    .replace(/```json/i, "")
    .replace(/```/g, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");
  if (firstBrace !== -1) cleaned = cleaned.slice(firstBrace);

  const lastBrace = cleaned.lastIndexOf("}");
  if (lastBrace !== -1) cleaned = cleaned.slice(0, lastBrace + 1);

  try {
    return JSON.parse(cleaned);
  } catch {
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
      return NextResponse.json(
        { error: "Unexpected error parsing request" },
        { status: 500 }
      );
    }

    const { jobPosition, jobDescription } = body || {};

    if (!jobPosition || !jobDescription) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Build prompt correctly
    const FINAL_PROMPT = QUESTIONS_PROMPT
      .replace("{{jobPosition}}", jobPosition)
      .replace("{{jobDescription}}", jobDescription);

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
        completion = await openai.chat.completions.create({
          model,
          messages: [
            {
              role: "system",
              content:
                "Return JSON only. Format: { \"interviewQuestions\": [] }",
            },
            {
              role: "user",
              content: FINAL_PROMPT,
            },
          ],
          max_tokens: 1000,
        });

        break;
      } catch (err) {
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

    const rawContent = completion.choices?.[0]?.message?.content || "";
    const parsed = extractJSON(rawContent);

    return NextResponse.json(
      { interviewQuestions: parsed.interviewQuestions || [] },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Unexpected error" },
      { status: 500 }
    );
  }
}
