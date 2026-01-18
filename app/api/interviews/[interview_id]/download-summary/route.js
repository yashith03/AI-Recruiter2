export async function GET(req, { params }) {
  try {
    const { interview_id } = params;
    
    // Server-side environment check
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    console.log("SERVER: Download request for ID:", interview_id);
    console.log("SERVER: Supabase Config - URL existing:", !!url, "Key existing:", !!key);

    if (!url || !key) {
        return NextResponse.json({ error: "Supabase environment variables missing on server" }, { status: 500 });
    }

    // 1. Check if the table even exists or is accessible
    const { data: feedbackRows, error: dbError } = await supabase
      .from("interview-feedback")
      .select("*")
      .eq("interview_id", interview_id)
      .order('created_at', { ascending: false });

    console.log("SERVER: Database query result count:", feedbackRows?.length || 0);

    if (dbError) {
      console.error("SERVER: Supabase DB Error:", dbError);
      return NextResponse.json({ 
          error: "Database error", 
          details: dbError.message,
          hint: dbError.hint 
      }, { status: 500 });
    }

    if (!feedbackRows || feedbackRows.length === 0) {
      console.warn("SERVER: No feedback record found for", interview_id);
      return NextResponse.json({ 
          error: "Summary PDF not found",
          message: "No interview record matches this ID. Did the interview summary finish generating?" 
      }, { status: 404 });
    }

    const data = feedbackRows[0];

    if (!data.pdf_url) {
      console.warn("SERVER: Record found but pdf_url is empty for", interview_id);
      return NextResponse.json({ error: "PDF URL is missing in the record" }, { status: 404 });
    }

    console.log("SERVER: Fetching from storage URL:", data.pdf_url.substring(0, 50) + "...");
    const response = await fetch(data.pdf_url);
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error("SERVER: Storage fetch failed:", response.status, errorText);
        return NextResponse.json({ 
            error: "Failed to retrieve file from storage",
            status: response.status 
        }, { status: response.status });
    }

    const blob = await response.blob();
    return new Response(blob, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Interview_Summary_${interview_id}.pdf"`,
      },
    });
  } catch (e) {
    console.error("SERVER: Unhandled Download Error:", e);
    return NextResponse.json({ error: e.message || "Something went wrong" }, { status: 500 });
  }
}
