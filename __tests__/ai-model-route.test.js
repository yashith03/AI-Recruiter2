import { POST } from "@/app/(main)/api/ai-model/route";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

jest.mock("openai", () => {
  const mockCreate = jest.fn();
  return {
    OpenAI: jest.fn().mockImplementation(() => ({
      chat: { completions: { create: mockCreate } },
    })),
  };
});

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({ data, ...init })),
  },
}));

const mockRequest = (body) => ({
  json: async () => body,
});

describe("POST /api/ai-model", () => {
  const mockCompletion = {
    choices: [{ message: { content: '```json{"interviewQuestions":["Q1","Q2"]}```' } }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns 200 and parsed result when model succeeds", async () => {
    const mockCreate = OpenAI.mock.results[0].value.chat.completions.create;
    mockCreate.mockResolvedValueOnce(mockCompletion);

    const req = mockRequest({
      jobPosition: "Frontend Engineer",
      jobDescription: "React expert",
      duration: "30 Min",
      type: "technical",
    });

    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(res.data.result.interviewQuestions).toEqual(["Q1", "Q2"]);
    expect(mockCreate).toHaveBeenCalled();
  });

  test("falls back to next model when first fails", async () => {
    const mockCreate = OpenAI.mock.results[0].value.chat.completions.create;
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
    const mockCreate = OpenAI.mock.results[0].value.chat.completions.create;
    mockCreate.mockRejectedValue(new Error("All models failed"));

    const req = mockRequest({
      jobPosition: "Designer",
      jobDescription: "UI/UX design",
      duration: "15 Min",
      type: "creative",
    });

    const res = await POST(req);

    expect(res.status).toBe(500);
    expect(res.data.error).toContain("All models failed");
  });

  test("replaces placeholders correctly in QUESTIONS_PROMPT", async () => {
    const req = mockRequest({
      jobPosition: "DevOps Engineer",
      jobDescription: "Cloud and CI/CD",
      duration: "60 Min",
      type: "technical",
    });

    const mockCreate = OpenAI.mock.results[0].value.chat.completions.create;
    mockCreate.mockResolvedValueOnce(mockCompletion);

    await POST(req);

    // Verify string replacement worked through mock call
    const [args] = mockCreate.mock.calls[0];
    expect(args.messages[0].content).toContain("DevOps Engineer");
    expect(args.messages[0].content).toContain("Cloud and CI/CD");
  });
});
