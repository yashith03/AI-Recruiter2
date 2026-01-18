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

    // conversation is an object/array here, so stringify once
    const FINAL_PROMPT = FEEDBACK_PROMPT.replace(
      "{{conversation}}",
      JSON.stringify(conversation)
    );

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model:  "openai/gpt-oss-20b:free",
      messages: [{ role: "user", content: FINAL_PROMPT }],
      max_tokens: 800,
    });

    const content = completion.choices?.[0]?.message?.content || "";

     if (!content) {
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