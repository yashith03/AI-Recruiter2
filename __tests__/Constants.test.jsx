import { SideBarOptions, InterviewType, QUESTIONS_PROMPT, CANDIDATE_SUMMARY_PROMPT, FEEDBACK_PROMPT } from "@/services/Constants";

describe("Constants Service", () => {
  describe("SideBarOptions", () => {
    test("contains all expected sidebar items", () => {
      expect(SideBarOptions).toHaveLength(6);
      
      const names = SideBarOptions.map(option => option.name);
      expect(names).toContain("Dashboard");
      expect(names).toContain("Schedule Interview");
      expect(names).toContain("All Interview");
      expect(names).toContain("Notifications");
      expect(names).toContain("Billing");
      expect(names).toContain("Settings");
    });

    test("each sidebar option has required properties", () => {
      SideBarOptions.forEach(option => {
        expect(option).toHaveProperty("name");
        expect(option).toHaveProperty("icon");
        expect(option).toHaveProperty("path");
      });
    });

    test("paths start with forward slash", () => {
      SideBarOptions.forEach(option => {
        expect(option.path).toMatch(/^\//);
      });
    });
  });

  describe("InterviewType", () => {
    test("contains all expected interview types", () => {
      expect(InterviewType).toHaveLength(5);
      
      const titles = InterviewType.map(type => type.title);
      expect(titles).toContain("Technical");
      expect(titles).toContain("Behavioral");
      expect(titles).toContain("Experience");
      expect(titles).toContain("Problem Solving");
      expect(titles).toContain("Leadership");
    });

    test("each interview type has required properties", () => {
      InterviewType.forEach(type => {
        expect(type).toHaveProperty("title");
        expect(type).toHaveProperty("icon");
      });
    });
  });

  describe("Prompts", () => {
    test("QUESTIONS_PROMPT contains required placeholders", () => {
      expect(QUESTIONS_PROMPT).toContain("{{jobTitle}}");
      expect(QUESTIONS_PROMPT).toContain("{{jobDescription}}");
      expect(QUESTIONS_PROMPT).toContain("{{duration}}");
      expect(QUESTIONS_PROMPT).toContain("{{type}}");
    });

    test("CANDIDATE_SUMMARY_PROMPT contains conversation placeholder", () => {
      expect(CANDIDATE_SUMMARY_PROMPT).toContain("{{conversation}}");
    });

    test("FEEDBACK_PROMPT contains conversation placeholder", () => {
      expect(FEEDBACK_PROMPT).toContain("{{conversation}}");
    });

    test("prompts are non-empty strings", () => {
      expect(typeof QUESTIONS_PROMPT).toBe("string");
      expect(QUESTIONS_PROMPT.length).toBeGreaterThan(0);
      
      expect(typeof CANDIDATE_SUMMARY_PROMPT).toBe("string");
      expect(CANDIDATE_SUMMARY_PROMPT.length).toBeGreaterThan(0);
      
      expect(typeof FEEDBACK_PROMPT).toBe("string");
      expect(FEEDBACK_PROMPT.length).toBeGreaterThan(0);
    });
  });
});
