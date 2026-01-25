import { extractJSON, STATIC_FALLBACKS } from "@/services/ai/utils";

describe("AI Utils", () => {
    describe("extractJSON", () => {
        it("should extract JSON from a clean string", () => {
             const input = '{"key": "value"}';
             const result = extractJSON(input);
             expect(result).toEqual({ key: "value" });
        });

        it("should extract JSON from a markdown string", () => {
            const input = 'Here is the json: ```json\n{"key": "value"}\n```';
            const result = extractJSON(input);
            expect(result).toEqual({ key: "value" });
       });

       it("should extract JSON from a string with surrounding text", () => {
            const input = 'Some text before {"key": "value"} some text after';
            const result = extractJSON(input);
            expect(result).toEqual({ key: "value" });
        });

        it("should return empty object for invalid JSON", () => {
            const input = '{"key": "value"'; // Missing closing brace
            const result = extractJSON(input);
            expect(result).toEqual({});
        });

        it("should return empty object for no JSON boundaries", () => {
            const input = 'Just some text';
            const result = extractJSON(input);
            expect(result).toEqual({});
        });

        it("should handle null or undefined input", () => {
            expect(extractJSON(null)).toEqual({});
            expect(extractJSON(undefined)).toEqual({});
        });
    });

    describe("STATIC_FALLBACKS", () => {
        it("should have questions fallback", () => {
            expect(STATIC_FALLBACKS.questions).toBeDefined();
            expect(STATIC_FALLBACKS.questions.interviewQuestions).toBeInstanceOf(Array);
        });

        it("should have feedback fallback", () => {
            expect(STATIC_FALLBACKS.feedback).toBeDefined();
            expect(STATIC_FALLBACKS.feedback.score).toBeDefined();
        });

        it("should have summary fallback", () => {
            expect(STATIC_FALLBACKS.summary).toBeDefined();
            expect(STATIC_FALLBACKS.summary.overallFeedback).toBeDefined();
        });
    });
});
