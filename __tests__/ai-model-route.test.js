import { POST } from "@/app/api/ai-model/route";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const mockCreate = jest.fn();

jest.mock("openai", () => {
  return {
    OpenAI: jest.fn().mockImplementation(() => ({
      chat: { completions: { create: mockCreate } },
    })),
  };
});

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({ ...data, ...init })),
  },
}));

const mockRequest = (body) => ({
  json: async () => body,
});

describe("POST /api/ai-model", () => {
  const mockCompletion = {
    choices: [
      { message: { content: '```json{"interviewQuestions":["Q1","Q2"]}```' } },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns 200 and parsed result when model succeeds", async () => {
    mockCreate.mockResolvedValueOnce(mockCompletion);

    const req = mockRequest({
      jobPosition: "Frontend Engineer",
      jobDescription: "React expert",
      duration: "30 Min",
      type: "technical",
    });

    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(res.result.interviewQuestions).toEqual(["Q1", "Q2"]);
    expect(mockCreate).toHaveBeenCalled();
  });

  test("falls back to next model when first fails", async () => {
    mockCreate
      .mockRejectedValueOnce(new Error("Model 1 failed"))
      .mockResolvedValueOnce(mockCompletion);

    const req = mockRequest({
      jobPosition: "QA Engineer",
      jobDescription: "Testing APIs",
      duration: "15 Min",
      type: "behavioral",
    });

    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(mockCreate).toHaveBeenCalledTimes(2);
  });

  test("returns 500 when all models fail", async () => {
    mockCreate.mockRejectedValue(new Error("All models failed"));

    const req = mockRequest({
      jobPosition: "Designer",
      jobDescription: "UI/UX design",
      duration: "15 Min",
      type: "creative",
    });

    const res = await POST(req);

    expect(res.status).toBe(500);
    expect(res.error).toContain("All models failed");
  });

  test("replaces placeholders correctly in QUESTIONS_PROMPT", async () => {
    mockCreate.mockResolvedValueOnce(mockCompletion);

    const req = mockRequest({
      jobPosition: "DevOps Engineer",
      jobDescription: "Cloud and CI/CD",
      duration: "60 Min",
      type: "technical",
    });

    await POST(req);

    const args = mockCreate.mock.calls[0][0];
    expect(args.messages[0].content).toContain("DevOps Engineer");
    expect(args.messages[0].content).toContain("Cloud and CI/CD");
  });
});
