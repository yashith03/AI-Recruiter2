// app/api/interviews/process-result/route.jsx

import { generateWithFallback } from "@/services/ai/providerSwitcher";
import { extractJSON, STATIC_FALLBACKS } from "@/services/ai/utils";
import { CANDIDATE_SUMMARY_PROMPT, FEEDBACK_PROMPT } from "@/services/Constants";
import moment from "moment";
import puppeteer from "puppeteer";
import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/services/supabaseServer";

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
    console.log("process-result API called");

    const body = await req.json();
    const { interview_id, conversation, userName, userEmail, recording_path } = body || {};

    if (!interview_id || !conversation || !userName || !userEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Fetch Interview Data
    const { data: interview, error: interviewError } = await supabase
      .from("interviews")
      .select("*")
      .eq("interview_id", interview_id)
      .single();

    if (interviewError || !interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    const trimmedConversation = Array.isArray(conversation)
      ? conversation.slice(-15)
      : conversation;

    // 2. Generate Internal Recruiter Feedback
    console.log(" Generating Recruiter Feedback...");
    let feedbackJson;
    try {
      const feedbackPrompt = FEEDBACK_PROMPT.replaceAll("{{conversation}}", JSON.stringify(trimmedConversation));
      const rawFeedback = await generateWithFallback(feedbackPrompt);
      feedbackJson = extractJSON(rawFeedback);
      if (Object.keys(feedbackJson).length === 0) throw new Error("Invalid Feedback JSON");
    } catch (err) {
      console.error("Recruiter Feedback Fallback:", err.message);
      feedbackJson = STATIC_FALLBACKS.feedback;
    }

    // 3. Generate External Candidate Summary (for PDF)
    console.log(" Generating Candidate Summary...");
    let summaryJson;
    try {
      const summaryPrompt = CANDIDATE_SUMMARY_PROMPT.replaceAll("{{conversation}}", JSON.stringify(trimmedConversation));
      const rawSummary = await generateWithFallback(summaryPrompt);
      summaryJson = extractJSON(rawSummary);
      if (Object.keys(summaryJson).length === 0) throw new Error("Invalid Summary JSON");
    } catch (err) {
      console.error("Candidate Summary Fallback:", err.message);
      summaryJson = STATIC_FALLBACKS.summary;
    }

    // 4. Prepare PDF Content (No Score)
    const position = interview.jobPosition || "Candidate";
    const date = moment().format("MMMM Do, YYYY");
    const startTime = moment().format("hh:mm A");
    const durationStr = interview.duration || "Unknown";

    const askedQuestions = (Array.isArray(interview.questionList) ? interview.questionList : [])
      .map(normalizeQuestion)
      .filter(Boolean);
    
    const questionsHtml = askedQuestions.map((text) => `<li>${text}</li>`).join("");
    const improvementsHtml = summaryJson.improvements.map((item) => `<li>${item}</li>`).join("");

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
          <h2>Asked Questions</h2>
          <ol>${questionsHtml}</ol>
        </section>

        <section class="section">
          <h2>Overall Feedback</h2>
          <p>${summaryJson.overallFeedback}</p>
        </section>

        <section class="section">
          <h2>Areas for Improvement</h2>
          <ul>${improvementsHtml}</ul>
        </section>
      </body>
      </html>
    `;

    // 5. Generate and Store PDF
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

    const fileName = `Interview_Summary_${userName.replace(/\s+/g, '_')}_${moment().format("YYYY-MM-DD")}.pdf`;
    const filePath = `summaries/${interview_id}/${fileName}`;

    const { error: uploadError } = await supabase.storage.from("interview-summaries").upload(filePath, pdfBuffer, {
      contentType: "application/pdf",
      upsert: true,
    });

    if (uploadError) throw new Error("Failed to upload PDF: " + uploadError.message);

    const { data: publicData } = supabase.storage.from("interview-summaries").getPublicUrl(filePath);
    const publicUrl = publicData?.publicUrl;

    // 6. Save to Database (Manual Upsert to bypass missing constraint)
    console.log(" Saving results to database...");
    const feedbackPayload = {
      userName,
      userEmail,
      interview_id,
      feedback: feedbackJson,
      recommendation: feedbackJson.recommendation === "Recommended",
      candidate_summary: summaryJson,
      pdf_url: publicUrl,
      recording_path: recording_path || null,
      asked_questions: askedQuestions,
      interview_date: moment().format("YYYY-MM-DD"),
      start_time: startTime,
      duration: durationStr,
    };

    const { data: existingFeedback } = await supabase
      .from("interview-feedback")
      .select("id")
      .eq("interview_id", interview_id)
      .maybeSingle();

    let feedbackError;
    if (existingFeedback) {
      const { error } = await supabase
        .from("interview-feedback")
        .update(feedbackPayload)
        .eq("id", existingFeedback.id);
      feedbackError = error;
    } else {
      const { error } = await supabase
        .from("interview-feedback")
        .insert(feedbackPayload);
      feedbackError = error;
    }

    if (feedbackError) throw new Error("Database Save Error: " + feedbackError.message);

    console.log("✅ Process complete for", interview_id);
    return NextResponse.json({ success: true, pdfUrl: publicUrl });

  } catch (e) {
    console.error("❌ Process Result Error:", e);
    return NextResponse.json({ error: e.message || "Internal Server Error" }, { status: 500 });
  }
}

