// services/ai/providers/nvidiaProvider.js

import OpenAI from "openai";
import { BaseProvider } from "./baseProvider";

export class NvidiaProvider extends BaseProvider {
  name = "nvidia";

  client = new OpenAI({
    apiKey: process.env.NVIDIA_API_KEY,
    baseURL: "https://integrate.api.nvidia.com/v1",
  });

  async generate(prompt) {
    const res = await this.client.chat.completions.create({
      model: "meta/llama-3.1-405b-instruct",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
    });

    return res.choices?.[0]?.message?.content || "";
  }
}
