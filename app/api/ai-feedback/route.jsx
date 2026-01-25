// app/api/ai-feedback/route.jsx

import { NextResponse } from "next/server";
import { FEEDBACK_PROMPT } from "@/services/Constants";
import OpenAI from "openai";

// Helper: Extract clean JSON from model output
function extractJSON(output) {
  try {
    let cleaned = output
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start === -1 || end === -1 || end < start) {
      return {};
    }

    cleaned = cleaned.substring(start, end + 1);
    const parsed = JSON.parse(cleaned);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch (err) {
    return {};
  }
}

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
      "google/gemini-2.0-flash-exp:free",
      "google/gemma-2-9b-it:free",
      "meta-llama/llama-3.2-3b-instruct:free",
      "mistralai/mistral-small-24b-instruct-2501:free",
      "qwen/qwen-2.5-7b-instruct:free",
    ];

    const trimmedConversation = Array.isArray(conversation)
      ? conversation.slice(-15)
      : conversation;

    const FINAL_PROMPT = FEEDBACK_PROMPT.replaceAll(
      "{{conversation}}",
      JSON.stringify(trimmedConversation)
    );


    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

let completion = null;
let lastError = null;

for (let i = 0; i < models.length; i++) {
  const model = models[i];
  try {
    // Add small delay between models to avoid 429 pressure
    if (i > 0) await new Promise((res) => setTimeout(res, 1000));

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
    console.log("Raw AI content:", content.slice(0, 100) + "...");

    const parsed = extractJSON(content);
    
    if (Object.keys(parsed).length === 0) {
      console.error("AI returned invalid JSON or empty content");
      return NextResponse.json(
        { error: "AI returned invalid format", raw: content },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { content: JSON.stringify(parsed) },
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