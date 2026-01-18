// app/api/interviews/process-result/route.jsx

import { NextResponse } from "next/server";
import { supabase } from "@/services/supabaseClient";
import OpenAI from "openai";
import puppeteer from "puppeteer";
import { CANDIDATE_SUMMARY_PROMPT } from "@/services/Constants";
import moment from "moment";

export async function POST(req) {
  try {
    const { interview_id, conversation, userName, userEmail } = await req.json();

    if (!interview_id || !conversation || !userName || !userEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Fetch Interview Data (System data)
    const { data: interview, error: interviewError } = await supabase
      .from("interviews")
      .select("*")
      .eq("interview_id", interview_id)
      .single();

    if (interviewError || !interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    // 2. Generate Candidate Summary via AI
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const FINAL_PROMPT = CANDIDATE_SUMMARY_PROMPT.replace(
      "{{conversation}}",
      JSON.stringify(conversation)
    );

    let summaryJson = null;
    let retries = 2;

    while (retries > 0) {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: FINAL_PROMPT }],
      });

      const content = completion.choices?.[0]?.message?.content || "";
      
      try {
        summaryJson = JSON.parse(content);
        // Validation
        if (
          summaryJson.overallFeedback &&
          typeof summaryJson.score === "number" &&
          summaryJson.score >= 0 &&
          summaryJson.score <= 10 &&
          Array.isArray(summaryJson.improvements) &&
          summaryJson.improvements.length >= 1
        ) {
          break; // success
        }
      } catch (e) {
        console.error("AI Response Parsing/Validation Failed:", content);
      }
      retries--;
    }

    if (!summaryJson) {
      throw new Error("Failed to generate valid AI summary after retries");
    }

    // 3. Prepare PDF Content
    const position = interview.jobPosition || "Candidate";
    const date = moment().format("MMMM Do, YYYY");
    const startTime = moment().format("hh:mm A"); // We could pass this from frontend if tracked
    const durationStr = "15 minutes 30 seconds"; // We should probably pass actual duration

    const askedQuestions = interview.questionList || [];
    const questionsHtml = askedQuestions
      .map((q, i) => `<li>${q.question}</li>`)
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
    await page.setContent(htmlContent);
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
      console.error("Storage upload error:", uploadError);
      // Fallback: If storage fails, we still have the summary JSON.
    }

    const { data: { publicUrl } } = supabase.storage
      .from("interview-summaries")
      .getPublicUrl(filePath);

    // 6. Save Summary and PDF URL to Database
    console.log("Saving to interview-feedback table...");
    const { error: feedbackError } = await supabase.from("interview-feedback").insert([
      {
        userName,
        userEmail,
        interview_id,
        feedback: summaryJson.overallFeedback, 
        recommendation: summaryJson.score >= 7,
        candidate_summary: summaryJson,
        pdf_url: publicUrl,
        asked_questions: askedQuestions.map(q => q.question),
        interview_date: moment().format("YYYY-MM-DD"),
        start_time: startTime,
        duration: durationStr,
      },
    ]);

    if (feedbackError) {
      console.error("Database Save Error:", feedbackError);
      return NextResponse.json({ error: "Failed to save feedback data" }, { status: 500 });
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
