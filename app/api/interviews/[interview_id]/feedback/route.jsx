// app/api/interviews/[interview_id]/feedback/route.jsx

import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/services/supabaseServer";

export async function GET(req, { params }) {
  try {
    const { interview_id } = await params;
    const supabase = getSupabaseServer();

    console.log(`Server-side fetch feedback: ${interview_id}`);

    const { data, error } = await supabase
      .from("interview-feedback")
      .select("*")
      .eq("interview_id", interview_id)
      .maybeSingle();

    if (error) {
      console.error("Supabase server-side feedback fetch error:", error);
      return NextResponse.json(
        { error: "Error fetching feedback" },
        { status: 500 }
      );
    }

    return NextResponse.json(data || null, { status: 200 });

  } catch (err) {
    console.error("Fetch Feedback API Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
