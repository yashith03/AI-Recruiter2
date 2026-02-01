// app/api/interviews/[interview_id]/feedback/route.jsx

import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/services/supabaseServer";

export async function GET(req, { params }) {
  try {
    const resolvedParams = await params;
    const { interview_id } = resolvedParams;
    
    console.log(`[GET Feedback] Request received for ID: ${interview_id}`);

    if (!interview_id) {
       return NextResponse.json({ error: "No interview_id provided" }, { status: 400 });
    }

    const supabase = getSupabaseServer();
    if (!supabase) {
        console.error("[GET Feedback] Supabase client could not be initialized");
        return NextResponse.json({ error: "Supabase client init error" }, { status: 500 });
    }

    const { data, error } = await supabase
      .from("interview-feedback")
      .select("*")
      .eq("interview_id", interview_id)
      .order('id', { ascending: false })
      .limit(1);

    if (error) {
      console.error("[GET Feedback] Supabase fetch error:", error.message);
      return NextResponse.json(
        { error: "Error fetching feedback", details: error.message },
        { status: 500 }
      );
    }

    const result = data && data.length > 0 ? data[0] : null;
    console.log(`[GET Feedback] Success for ${interview_id}, data found: ${!!result}`);
    return NextResponse.json(result, { status: 200 });

  } catch (err) {
    console.error("[GET Feedback] Catch block error:", err.message, err.stack);
    return NextResponse.json(
      { error: "Internal Server Error", message: err.message },
      { status: 500 }
    );
  }
}
