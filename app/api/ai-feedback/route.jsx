// app/api/ai-feedback/route.jsx

import { generateWithFallback } from "@/services/ai/providerSwitcher";
import { extractJSON, STATIC_FALLBACKS } from "@/services/ai/utils";
import { FEEDBACK_PROMPT } from "@/services/Constants";
import { NextResponse } from "next/server";

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

    const trimmedConversation = Array.isArray(conversation)
      ? conversation.slice(-15)
      : conversation;

    const FINAL_PROMPT = FEEDBACK_PROMPT.replaceAll(
      "{{conversation}}",
      JSON.stringify(trimmedConversation)
    );

    try {
      const rawContent = await generateWithFallback(FINAL_PROMPT);
      const parsed = extractJSON(rawContent);
      
      if (Object.keys(parsed).length === 0) {
        throw new Error("AI returned invalid JSON or empty content");
      }

      return NextResponse.json(
        { content: JSON.stringify(parsed) },
        { status: 200 }
      );
    } catch (aiErr) {
      console.error("All AI Providers failed, using STATIC FALLBACK:", aiErr.message);
      return NextResponse.json(
        { content: JSON.stringify(STATIC_FALLBACKS.feedback) },
        { status: 200 }
      );
    }

  } catch (e) {
   console.error("AI FEEDBACK ERROR:", e);
    return NextResponse.json(
      { error: e.message || "Something went wrong" },
      { status: 500 }
    );
  }
}