/**
 * @jest-environment node
 */
import { POST } from "@/app/api/ai-model/route";
import { NextResponse } from "next/server";
import { generateWithFallback } from "@/services/ai/providerSwitcher";

// Mock the provider switcher
jest.mock("@/services/ai/providerSwitcher", () => ({
  generateWithFallback: jest.fn(),
}));

// Mock next/server
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      json: async () => body,
      status: init?.status || 200,
      body,
    })),
  },
}));

describe("POST /api/ai-model", () => {
  let mockRequest;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      json: async () => ({
        jobPosition: "Developer",
        jobDescription: "Codes stuff",
        duration: "15 min",
        type: "Technical",
      }),
    };
  });

  test("returns 400 if missing jobPosition", async () => {
    mockRequest.json = async () => ({
      jobDescription: "Codes stuff",
      duration: "15 min",
      type: "Technical",
    });

    const response = await POST(mockRequest);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Missing required fields" });
  });

  test("returns 500 if req.json() fails", async () => {
    mockRequest.json = async () => {
      throw new Error("Parse error");
    };

    const response = await POST(mockRequest);
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Unexpected error parsing request" });
  });

  test("returns interview questions on success", async () => {
    const mockQuestions = { 
        interviewQuestions: [
          { question: "Q1", answer: "A1", type: "Technical" }
        ] 
      };
    
    // Mock generateWithFallback to return a JSON string
    generateWithFallback.mockResolvedValue(`
      Here is the JSON:
      \`\`\`json
      ${JSON.stringify(mockQuestions)}
      \`\`\`
    `);

    const response = await POST(mockRequest);
    
    expect(generateWithFallback).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockQuestions);
  });

  test("returns static fallback if provider fails", async () => {
    // Mock generateWithFallback to throw an error
    generateWithFallback.mockRejectedValue(new Error("All providers failed"));

    const response = await POST(mockRequest);

    expect(generateWithFallback).toHaveBeenCalled();
    expect(response.status).toBe(200); // Route catches error and returns fallback
    // Verify it returns the STATIC_FALLBACKS structure (checking one key property)
    expect(response.body.interviewQuestions).toBeDefined();
    expect(response.body.interviewQuestions.length).toBeGreaterThan(0);
  });
});
