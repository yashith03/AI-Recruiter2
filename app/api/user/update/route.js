// app/api/user/update/route.js

import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/services/supabaseServer";

export async function POST(req) {
  try {
    const supabase = getSupabaseServer();
    const body = await req.json();

    const {
      name,
      phone,
      job,
      company,
      userEmail,
    } = body;

    if (!userEmail) {
      return NextResponse.json(
        { error: "Unauthorized: Missing user email" },
        { status: 401 }
      );
    }

    // Update user information
    const { data, error } = await supabase
      .from("users")
      .update({
        name,
        phone,
        job,
        company,
      })
      .eq("email", userEmail)
      .select()
      .single();

    if (error) {
      console.error("Supabase user update error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, user: data }, { status: 200 });

  } catch (err) {
    console.error("User Update API Error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
