// services/ai/providers/baseProvider.js

export class BaseProvider {
  name = "base";

  async generate(prompt) {
    throw new Error("generate() not implemented");
  }
}
