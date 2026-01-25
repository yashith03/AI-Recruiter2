// services/ai/providers/openRouterProvider.js

import OpenAI from "openai";
import { BaseProvider } from "./baseProvider";

export class OpenRouterProvider extends BaseProvider {
  name = "openrouter";

  client = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
  });

  async generate(prompt) {
    const res = await this.client.chat.completions.create({
      model: "google/gemini-2.0-flash-exp:free",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
    });

    return res.choices?.[0]?.message?.content || "";
  }
}
