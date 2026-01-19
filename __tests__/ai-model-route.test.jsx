/**
 * @jest-environment node
 */
import { POST } from "@/app/api/ai-model/route";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

// Mock OpenAI
jest.mock("openai", () => {
  const mockCreate = jest.fn();
  return {
    OpenAI: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    })),
    __mockCreate: mockCreate,
  };
});

// Mock next/server
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      // mimic actual Response-like object enough for tests if needed, or just plain data
      json: async () => body,
      status: init?.status || 200,
      body,
    })),
  },
}));

describe("POST /api/ai-model", () => {
  let mockRequest;
  let mockCreate;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Get the shared mock function
    const { __mockCreate } = require("openai");
    mockCreate = __mockCreate;

    // Default valid request
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

  test("returns 400 if missing jobDescription", async () => {
    mockRequest.json = async () => ({
      jobPosition: "Dev",
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

  test("calls OpenAI and returns interview questions", async () => {
    const mockQuestions = { 
      interviewQuestions: [
        { question: "Q1", answer: "A1" }
      ] 
    };

    mockCreate.mockResolvedValueOnce({
      choices: [
        { message: { content: JSON.stringify(mockQuestions) } }
      ]
    });

    const response = await POST(mockRequest);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ interviewQuestions: mockQuestions.interviewQuestions });
  });

  test("handles empty or invalid AI response gracefully", async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [
        { message: { content: "invalid json" } }
      ]
    });

    const response = await POST(mockRequest);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ interviewQuestions: [] });
  });

  test("tries multiple models if first one fails", async () => {
    // First call fails
    mockCreate.mockRejectedValueOnce({ status: 429 });
    // Second call succeeds
    mockCreate.mockResolvedValueOnce({
      choices: [
        { message: { content: `{"interviewQuestions": []}` } }
      ]
    });

    await POST(mockRequest);
    expect(mockCreate).toHaveBeenCalledTimes(2);
  });

  test("returns 500 if all models fail", async () => {
    // Actually the loop has 5 models.
    for(let i=0; i<5; i++) {
        mockCreate.mockRejectedValueOnce(new Error("Fail"));
    }

    const response = await POST(mockRequest);
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "All FREE models failed or rate-limited" });
  });
});
