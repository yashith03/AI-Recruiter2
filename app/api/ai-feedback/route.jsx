// app/api/ai-feedback/route.jsx

import { NextResponse } from "next/server";
import { FEEDBACK_PROMPT } from "@/services/Constants";
import OpenAI from "openai";

export async function POST(req) {
  try {
        let body;

    try {
      body = await req.json();
    } catch (err) {
      console.error("Request JSON parse error:", err);
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { conversation } = body || {};

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation missing" },
        { status: 400 }
      );
    }

    const models = [
      "nvidia/nemotron-nano-9b-v2:free",
      "kwaipilot/kat-coder-pro-v1:free",
      "nvidia/nemotron-nano-12b-vl:free",
       "openai/gpt-oss-20b:free",
      "x-ai/grok-4.1-fast:free",
    ];

    // conversation is an object/array here, so stringify once
    const FINAL_PROMPT = FEEDBACK_PROMPT.replace(
      "{{conversation}}",
      JSON.stringify(conversation)
    );

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

let completion = null;
let lastError = null;

for (const model of MODELS) {
  try {
    console.log("Trying model:", model);

    completion = await openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: FINAL_PROMPT }],
      max_tokens: 800,
    });

    // success → stop loop
    if (completion?.choices?.length) {
      console.log("Model succeeded:", model);
      break;
    }
  } catch (err) {
    console.error(`Model failed (${model}):`, err?.status || err?.message);
    lastError = err;

    // small delay helps OpenRouter rate limits
    if (err?.status === 429) {
      await new Promise(res => setTimeout(res, 500));
    }
  }
}

if (!completion) {
  return NextResponse.json(
    { error: "All AI models failed", details: lastError?.message },
    { status: 502 }
  );
}


    const content = completion.choices?.[0]?.message?.content || "";

     if (!content.trim()) {
      console.error("AI returned empty feedback");
      return NextResponse.json(
        { error: "AI returned empty feedback" },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { content },
      { status: 200 }
    );

  } catch (e) {
   console.error("AI FEEDBACK ERROR:", e);
    return NextResponse.json(
      { error: e.message || "Something went wrong" },
      { status: 500 }
    );
  }
}