// app/(main)/api/ai-model/route.jsx
import { QUESTIONS_PROMPT } from "@/services/Constants";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";


export async function POST(req){

    const {jobPosition, jobDescription, duration, type } = await req.json();
    const FINAL_PROMPT = QUESTIONS_PROMPT
    .replace("{{jobTitle}}", jobPosition)
    .replace("{{jobDescription}}", jobDescription)
    .replace("{{duration}}", duration)
    .replace("{{type}}", type);

    console.log(FINAL_PROMPT);

    try{

    const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY,
    });
    const completion = await openai.chat.completions.create({
        model: "google/gemini-2.0-flash-exp:free",
        messages: [
            { role: "user", content: FINAL_PROMPT }
    ],
    })
    console.log(completion.choices[0].message);
    return NextResponse.json({result: completion.choices[0].message}, {status: 200}  )

}
catch (error) {
  console.error("AI Model API Error:", error?.response?.data || error.message);

  return NextResponse.json(
    {
      error: error?.response?.data || "Failed to generate interview questions. Please try again later.",
    },
    { status: error?.status || 500 }
  );
}

}