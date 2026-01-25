// app/api/ai-model/route.jsx

import { generateWithFallback } from "@/services/ai/providerSwitcher";
import { extractJSON, STATIC_FALLBACKS } from "@/services/ai/utils";
import { QUESTIONS_PROMPT } from "@/services/Constants";
import { NextResponse } from "next/server";


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

    try {
      const rawContent = await generateWithFallback(FINAL_PROMPT);
      const parsed = extractJSON(rawContent);
      const questions = Array.isArray(parsed.interviewQuestions) ? parsed.interviewQuestions : [];

      if (questions.length > 0) {
        console.log(`AI generation succeeded with ${questions.length} questions.`);
        return NextResponse.json({ interviewQuestions: questions }, { status: 200 });
      } else {
        throw new Error("AI returned empty question list");
      }
    } catch (aiErr) {
      console.error("All AI Providers failed, using STATIC FALLBACK:", aiErr.message);
      return NextResponse.json(STATIC_FALLBACKS.questions, { status: 200 });
    }

  } catch (err) {
    console.error("AI MODEL API ERROR:", err);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
