// app/api/interviews/upload-recording/route.jsx

import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/services/supabaseServer";

export async function POST(req) {
  try {
    const supabase = getSupabaseServer();
    const formData = await req.formData();
    
    const file = formData.get("file");
    const interview_id = formData.get("interview_id");

    if (!file || !interview_id) {
      return NextResponse.json({ error: "Missing file or interview_id" }, { status: 400 });
    }

    const timestamp = Date.now();
    const fileName = `${interview_id}_${timestamp}.webm`;
    const filePath = `interviews/${interview_id}/${fileName}`;

    console.log(`[Upload Recording] Uploading for ${interview_id}...`);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from('interview-recordings')
      .upload(filePath, buffer, {
        contentType: 'video/webm',
        upsert: true
      });

    if (uploadError) {
      console.error("[Upload Recording] Supabase Storage Error:", uploadError.message);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    console.log(`[Upload Recording] Success: ${filePath}`);
    return NextResponse.json({ filePath });

  } catch (err) {
    console.error("[Upload Recording] API Catch Error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
