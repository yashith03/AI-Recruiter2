import { FEEDBACK_PROMPT } from "@/services/Constants";

export async function POST(req){
    const {converation} = await req.json();
    const FINAL_PROMPT=FEEDBACK_PROMPT.replace('{{conversation}}', JSON.stringify(conversation));
}
try{
    const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY,
      });
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: FINAL_PROMPT }],
      });
      return NextResponse.json({result:completion.choices[0].message.content});
}
catch(e){
    return NextResponse.json({error:e.message});
}