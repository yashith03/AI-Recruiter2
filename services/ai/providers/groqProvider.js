// services/ai/providers/groqProvider.js

import OpenAI from "openai";
import { BaseProvider } from "./baseProvider";

export class GroqProvider extends BaseProvider {
  name = "groq";

  client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });

  async generate(prompt) {
    const res = await this.client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
    });

    return res.choices?.[0]?.message?.content || "";
  }
}
