// app/api/interviews/save-session/route.jsx

import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/services/supabaseServer";

export async function POST(req) {
  try {
    const supabase = getSupabaseServer();
    const body = await req.json();

    const { 
      interview_id, 
      conversation, 
      userName, 
      userEmail, 
      recording_path 
    } = body;

    if (!interview_id || !userEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log(`[Save Session] Saving session for ${interview_id}`);

    // Persist conversation and candidate info to 'interview-feedback' table.
    // We store the conversation inside the 'feedback' column as a JSON object
    // to avoid schema changes while allowing the 'completed' page to recover it.
    const feedbackPayload = {
      interview_id,
      userEmail,
      userName: userName || "Candidate",
      recording_path: recording_path || null,
      feedback: { _temporary_session_data: conversation },
      interview_date: new Date().toISOString().split('T')[0],
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

    if (feedbackError) {
      console.error("[Save Session] DB Error:", feedbackError.message);
      return NextResponse.json({ error: feedbackError.message }, { status: 500 });
    }

    console.log(`[Save Session] Success for ${interview_id}`);
    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("[Save Session] API Error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
