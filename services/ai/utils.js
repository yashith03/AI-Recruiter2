// services/ai/utils.js

/**
 * Extract clean JSON from model output
 */
export function extractJSON(output) {
  try {
    if (!output) return {};

    // 1. Remove common markdown artifacts
    let cleaned = output
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // 2. Find the first '{' and last '}' to isolate the JSON object
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start === -1 || end === -1 || end < start) {
      console.warn("No JSON object boundaries found in AI output.");
      return {};
    }

    cleaned = cleaned.substring(start, end + 1);

    const parsed = JSON.parse(cleaned);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch (err) {
    console.error("extractJSON failed to parse:", err.message);
    return {};
  }
}

/**
 * Static fallbacks for when all AI models fail
 */
export const STATIC_FALLBACKS = {
  questions: {
    interviewQuestions: [
      {
        question: "Could you tell me about your background and your experience with the key technologies mentioned in the job description?",
        type: "Experience"
      },
      {
        question: "Describe a challenging technical problem you faced recently. How did you approach and solve it?",
        type: "Problem Solving"
      },
      {
        question: "How do you stay updated with the latest trends and best practices in your field?",
        type: "Behavioral"
      },
      {
        question: "Can you walk me through a project you are particularly proud of? What was your role and the outcome?",
        type: "Technical"
      },
      {
        question: "What is your typical process for collaborating with team members and stakeholders on a project?",
        type: "Behavioral"
      }
    ]
  },
  feedback: {
    score: 5,
    rating: {
      technicalSkills: 5,
      communication: 5,
      problemSolving: 5,
      experience: 5
    },
    summary: "The interview was completed, but AI evaluation was unavailable. Based on the conversation length, the candidate engaged with the questions provided.",
    recommendation: "Not Recommended",
    recommendationMsg: "Unable to provide a definitive recommendation due to technical limitations during evaluation."
  },
  summary: {
    overallFeedback: "The interview session has been recorded. Our AI system is currently experiencing high traffic, so we've provided this placeholder summary. You successfully went through the scheduled questions.",
    improvements: [
      "Focus on providing more concrete examples for technical questions.",
      "Practice structured communication (STAR method) for behavioral questions.",
      "Ensure you are familiar with all the core technologies listed in the job description."
    ]
  }
};
