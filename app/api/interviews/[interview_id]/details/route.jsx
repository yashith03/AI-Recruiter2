// app/api/interviews/[interview_id]/details/route.jsx

import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/services/supabaseServer";

export async function GET(req, { params }) {
  try {
    const { interview_id } = await params;
    const supabase = getSupabaseServer();

    console.log(` Server-side fetch interview details: ${interview_id}`);

    const { data, error } = await supabase
      .from("interviews")
      .select("jobPosition, jobDescription, duration, type, questionList")
      .eq("interview_id", interview_id)
      .single();

    if (error) {
      console.error("Supabase server-side fetch error:", error);
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data, { status: 200 });

  } catch (err) {
    console.error("Fetch Details API Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
