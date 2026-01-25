// services/ai/providerSwitcher.js

import { GroqProvider } from "./providers/groqProvider";
import { NvidiaProvider } from "./providers/nvidiaProvider";
import { OpenRouterProvider } from "./providers/openRouterProvider";

export async function generateWithFallback(prompt) {
  const providers = [
    new GroqProvider(),
    new NvidiaProvider(),
    new OpenRouterProvider(),
  ];

  let lastError;

  for (const provider of providers) {
    try {
      console.log(`🔁 Trying provider: ${provider.name}`);
      const result = await provider.generate(prompt);

      if (result && result.trim()) {
        console.log(`✅ Provider succeeded: ${provider.name}`);
        return result;
      }
    } catch (err) {
      console.warn(`❌ Provider failed: ${provider.name}`, err.message);
      lastError = err;
    }
  }

  throw new Error("All AI providers failed");
}
