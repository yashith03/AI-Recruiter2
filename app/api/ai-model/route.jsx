// app/api/ai-model/route.js

import { QUESTIONS_PROMPT } from "@/services/Constants";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

export async function POST(req) {
  try {
    const { jobPosition, jobDescription, duration, type } = await req.json();

    const typeString = Array.isArray(type)
      ? type.join(", ")
      : type || "";

    const FINAL_PROMPT = QUESTIONS_PROMPT
      .replace("{{jobTitle}}", jobPosition)
      .replace("{{jobDescription}}", jobDescription)
      .replace("{{duration}}", duration)
      .replace("{{type}}", typeString);

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
              content: "Return valid JSON with interviewQuestions array."
            },
            {
              role: "user",
              content: FINAL_PROMPT
            }
          ],
          max_tokens: 2000,
        });

        console.log("SUCCESS:", model);
        break;

      } catch (err) {
        console.log("FAILED:", model, err.message);

        if (err.status === 429) {
          await new Promise(res => setTimeout(res, 1500));
          continue;
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

    let parsed = {};

    try {
      const json = raw.match(/```json([\s\S]*?)```/)?.[1] || "{}";
      parsed = JSON.parse(json.trim());
    } catch {
      parsed = {};
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
