// app/api/interviews/process-result/route.jsx

import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/services/supabaseServer";
import OpenAI from "openai";
import puppeteer from "puppeteer";
import { CANDIDATE_SUMMARY_PROMPT } from "@/services/Constants";
import moment from "moment";

// Required for Puppeteer
export const runtime = "nodejs";

function normalizeQuestion(q) {
  if (typeof q === "string") return q;
  if (q && typeof q === "object" && typeof q.question === "string") return q.question;
  return "";
}

export async function POST(req) {
  const supabase = getSupabaseServer();
  try {
    console.log("▶️ process-result API called");

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

    const { interview_id, conversation, userName, userEmail } = body || {};

    console.log(" interview_id:", interview_id);
    console.log(" userName:", userName);
    console.log(" userEmail:", userEmail);
    console.log(
      " conversation length:",
      Array.isArray(conversation) ? conversation.length : "not-array"
    );
    if (!interview_id || !conversation || !userName || !userEmail) {
      console.warn(" Missing required fields");

      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    console.log(" Fetching interview from Supabase:", interview_id);

    // 1. Fetch Interview Data (System data)
    const { data: interview, error: interviewError } = await supabase
      .from("interviews")
      .select("*")
      .eq("interview_id", interview_id)
      .single();

    if (interviewError || !interview) {
      console.error(" Interview fetch failed:", interviewError);

      return NextResponse.json(
        { error: "Interview not found" }, 
        { status: 404 });
    }

    // 2. Generate Candidate Summary via AI

    const MODELS = [
      "google/gemini-2.0-flash-exp:free",
      "google/gemma-2-9b-it:free",
      "meta-llama/llama-3.2-3b-instruct:free",
      "mistralai/mistral-small-24b-instruct-2501:free",
      "qwen/qwen-2.5-7b-instruct:free",
    ];

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

const trimmedConversation = Array.isArray(conversation)
  ? conversation.slice(-15)
  : conversation;

const FINAL_PROMPT = CANDIDATE_SUMMARY_PROMPT.replaceAll(
  "{{conversation}}",
  JSON.stringify(trimmedConversation)
);

    console.log("AI prompt length:", FINAL_PROMPT.length);
    console.log("AI models being tried:", MODELS);

   let summaryJson = null;
let retries = 2;

while (retries > 0 && !summaryJson) {
  console.log(`▶️ AI Attempt (Retries left: ${retries})`);

  let completion = null;
  let lastError = null;

  for (let i = 0; i < MODELS.length; i++) {
    const model = MODELS[i];
    try {
      // Add small delay between models to avoid 429 pressure
      if (i > 0) await new Promise((res) => setTimeout(res, 1000));

      console.log(`..Trying model: ${model}`);

      completion = await openai.chat.completions.create({
        model,
        messages: [{ role: "user", content: FINAL_PROMPT }],
        max_tokens: 1000,
      });

      if (completion?.choices?.[0]?.message?.content) {
        console.log(`..✅ Model ${model} returned content.`);
        break;
      } else {
        console.warn(`..⚠️ Model ${model} returned empty choices.`);
        completion = null;
      }
    } catch (err) {
      console.error(`..❌ Model ${model} failed:`, err?.status || err?.message);
      lastError = err;

      if (err?.status === 429) {
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  }

  if (!completion) {
    console.error("Critical: All AI models failed to respond.");
    return NextResponse.json(
      { error: "All AI models failed to respond", details: lastError?.message },
      { status: 502 }
    );
  }

  const content = completion.choices?.[0]?.message?.content || "";
  console.log("RAW AI CONTENT PREVIEW:", content.slice(0, 150) + "...");

  if (!content.trim()) {
    console.error("Empty AI response");
    retries--;
    continue;
  }

  // 3. Parse + validate JSON
  try {
    console.log("Cleaning AI output...");
    let cleaned = content
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start !== -1 && end !== -1 && end > start) {
      cleaned = cleaned.substring(start, end + 1);
      const parsed = JSON.parse(cleaned);

      if (
        parsed.overallFeedback &&
        typeof parsed.score === "number" &&
        Array.isArray(parsed.improvements)
      ) {
        summaryJson = parsed;
        break;
      } else {
        console.warn("AI response failed validation", Object.keys(parsed));
      }
    } else {
      console.warn("No JSON boundaries found.");
    }
  } catch (e) {
    console.error("AI JSON parse failed:", e.message);
  }

  retries--;
}

if (!summaryJson) {
  return NextResponse.json(
    { error: "Failed to generate valid AI summary after retries" },
    { status: 502 }
  );
}

    // 3. Prepare PDF Content
    const position = interview.jobPosition || "Candidate";
    const date = moment().format("MMMM Do, YYYY");
    const startTime = moment().format("hh:mm A"); // We could pass this from frontend if tracked
    const durationStr = interview.duration || "Unknown";

       const askedQuestionsRaw = Array.isArray(interview.questionList)
      ? interview.questionList
      : [];

    const askedQuestions = askedQuestionsRaw
      .map(normalizeQuestion)
      .filter(Boolean);
    
    const questionsHtml = askedQuestions
      .map((text, i) => `<li>${text}</li>`)
      .join("");

    const improvementsHtml = summaryJson.improvements
      .map((item) => `<li>${item}</li>`)
      .join("");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; padding: 40px; }
          h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; text-align: center; }
          h2 { color: #1e40af; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; margin-top: 30px; }
          .section { margin-bottom: 25px; }
          .label { font-weight: bold; color: #4b5563; }
          .value { color: #111827; margin-left: 5px; }
          .score-box { background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; color: #2563eb; }
          ul, ol { padding-left: 20px; }
          li { margin-bottom: 8px; }
        </style>
      </head>
      <body>
        <h1>Interview Summary</h1>

        <section class="section">
          <h2>Candidate & Interview Details</h2>
          <p><span class="label">Candidate Name:</span> <span class="value">${userName}</span></p>
          <p><span class="label">Email:</span> <span class="value">${userEmail}</span></p>
          <p><span class="label">Position:</span> <span class="value">${position}</span></p>
          <p><span class="label">Interview Date:</span> <span class="value">${date}</span></p>
          <p><span class="label">Start Time:</span> <span class="value">${startTime}</span></p>
          <p><span class="label">Interview Duration:</span> <span class="value">${durationStr}</span></p>
        </section>

        <section class="section">
          <h2>Asked Questions & Overall Interview Feedback</h2>
          <h3>Asked Questions</h3>
          <ol>
            ${questionsHtml}
          </ol>
          <h3>Overall Feedback</h3>
          <p>${summaryJson.overallFeedback}</p>
        </section>

        <section class="section">
          <h2>Overall Score</h2>
          <div class="score-box">
            Overall Interview Score: ${summaryJson.score.toFixed(1)} / 10
          </div>
        </section>

        <section class="section">
          <h2>Areas for Improvement</h2>
          <ul>
            ${improvementsHtml}
          </ul>
        </section>
      </body>
      </html>
    `;

    // 4. Generate PDF
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ 
      format: "A4",
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });
    await browser.close();

    // 5. Store PDF in Supabase Storage
    const fileName = `Interview_Summary_${userName.replace(/\s+/g, '_')}_${position.replace(/\s+/g, '_')}_${moment().format("YYYY-MM-DD")}.pdf`;
    const filePath = `summaries/${interview_id}/${fileName}`;

    // Note: We need to use Supabase client with Service Role Key for backend uploads usually,
    // or ensure the bucket has correct RLS policies.
    // For now, we'll try to use the standard client or assume it works.
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("interview-summaries")
      .upload(filePath, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

 if (uploadError) {
  return NextResponse.json(
    { error: "Failed to upload interview summary PDF" },
    { status: 500 }
  );
}
    const { data: publicData } = supabase.storage
      .from("interview-summaries")
      .getPublicUrl(filePath);

    const publicUrl = publicData?.publicUrl;

    if (!publicUrl) {
      console.error("Failed to generate public PDF URL for", filePath);
  return NextResponse.json(
    { error: "Failed to generate interview summary PDF URL" },
    { status: 500 }
  );
}

    // 6. Save Summary and PDF URL to Database
    console.log("Saving to interview-feedback table...");
    const { error: feedbackError } = await supabase
    .from("interview-feedback")
    .insert([
      {
        userName,
        userEmail,
        interview_id,
        feedback: summaryJson.overallFeedback, 
        recommendation: summaryJson.score >= 7,
        candidate_summary: summaryJson,
        pdf_url: publicUrl,
        asked_questions: askedQuestions,
        interview_date: moment().format("YYYY-MM-DD"),
        start_time: startTime,
        duration: durationStr,
      },
    ]);

    if (feedbackError) {
      console.error("Database Save Error:", feedbackError);
      return NextResponse.json(
        { error: "Failed to save feedback data" }, 
        { status: 500 });
    }

    console.log("Process complete for", interview_id);
    return NextResponse.json({
      summary: summaryJson,
      pdfUrl: publicUrl,
    });
  } catch (e) {
    console.error("Process Result Error:", e);
    return NextResponse.json({ error: e.message || "Internal Server Error" }, { status: 500 });
  }
}
