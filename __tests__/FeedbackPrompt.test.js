//__tests__/FeedbackPrompt.test.js

import { FEEDBACK_PROMPT } from "@/services/Constants";

test("FEEDBACK_PROMPT contains required JSON keys", () => {
  expect(FEEDBACK_PROMPT).toContain('"score"');
  expect(FEEDBACK_PROMPT).toContain('"technicalSkills"');
  expect(FEEDBACK_PROMPT).toContain('"recommendation"');
  expect(FEEDBACK_PROMPT).toContain('"summary"');
});

