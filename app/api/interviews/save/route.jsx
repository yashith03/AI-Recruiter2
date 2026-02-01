// app/api/interviews/save/route.jsx

import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/services/supabaseServer";
import { CREDITS } from "@/app/utils/constants";

export async function POST(req) {
  try {
    const supabase = getSupabaseServer();
    const body = await req.json();

    console.log(" Server-side save interview called");

    const {
      jobPosition,
      jobDescription,
      duration,
      type,
      questionList,
      userEmail,
      interview_id,
    } = body;

    if (!interview_id || !userEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1. Atomic Credit Deduction via RPC
    const { data: allowed, error: rpcError } = await supabase
      .rpc('decrement_credits', { 
        user_email: userEmail, 
        credit_cost: CREDITS.INTERVIEW_COST 
      });

    if (rpcError) {
      console.error("RPC Error:", rpcError);
      return NextResponse.json({ error: "Details verification failed" }, { status: 500 });
    }

    if (!allowed) {
      return NextResponse.json(
        { error: "You have no credits left. Please upgrade your plan." }, 
        { status: 403 }
      );
    }

    const { data, error } = await supabase
      .from("interviews")
      .insert([
        {
          jobPosition,
          jobDescription,
          duration,
          type,
          questionList,
          userEmail,
          interview_id,
        },
      ]);

    if (error) {
      console.error("Supabase server-side insert error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    console.log("✅ Interview saved successfully (server-side)");
    return NextResponse.json({ success: true, data }, { status: 200 });

  } catch (err) {
    console.error("Save API Error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
