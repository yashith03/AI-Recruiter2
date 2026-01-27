// services/Constants.jsx

import { LayoutDashboard, List, CreditCard, BriefcaseBusinessIcon, LayoutBriefcaseBusinessIcon, Code2Icon, Puzzle, User2Icon , Star, Calendar, Settings, Bell } from "lucide-react"

export const SideBarOptions = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard"
  },
  {
    name: "All Interview",
    icon: List,
    path: "/all-interviews",
  },
   {
    name: "Schedule Interview",
    icon: Calendar,
    path: "/schedule-interview",
  },
   {
    name: "Completed Interview",
    icon: Calendar,
    path: "/completed-interview",
  },
  {
    name: "Notifications",
    icon: Bell,
    path: "/notifications",
  },
  {
    name: "Billing",
    icon: CreditCard,
    path: "/billing",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/settings",
  },

]
export const InterviewType = [
  {
    title : "Technical" ,
    icon : Code2Icon
  },
  {
    title : "Behavioral" ,
    icon : User2Icon
  },
  {
    title : "Experience" ,
    icon : BriefcaseBusinessIcon
  },
  {
    title : "Problem Solving" ,
    icon : Puzzle
  },
   {
    title : "Leadership" ,
    icon : Star
  }


]
export const QUESTIONS_PROMPT = `
You are an expert technical interviewer.
Based on the following inputs, generate a well-structured list of high-quality interview questions:

Job Title: {{jobTitle}}
Job Description: {{jobDescription}}
Interview Duration: {{duration}}
Interview Type: {{type}}

Your task:
Analyze the job description to identify key responsibilities, required skills, and expected experience.
Generate a list of interview questions depending on the interview duration.
Adjust the number and depth of questions to match the interview duration.
Ensure the questions match the tone and structure of a real-life {{type}} interview.

Format your response in JSON format with an array list of questions:
Format:
{
  "interviewQuestions": [
    {
      "question": "string",
      "type": "Technical | Behavioral | Experience | Problem Solving | Leadership"
    },
    {
      ...
    }
  ]
}

The goal is to create a structured, relevant, and time-optimized interview plan for a {{jobTitle}} role.

IMPORTANT: Respond ONLY in valid JSON. Do not include any explanations, markdown backticks, or extra text.
`;

export const CANDIDATE_SUMMARY_PROMPT = `
Based on the following interview conversation between an AI interviewer and a candidate, generate a professional, constructive, and neutral interview summary suitable for the candidate.

Conversation:
{{conversation}}

Return only valid JSON with the following structure:
{
  "overallFeedback": "One professional paragraph (3-5 sentences) summarizing the interview performance in a neutral, constructive, and supportive tone. Do not include hiring decisions or internal scoring details.",
  "improvements": [
    "Actionable improvement point 1",
    "Actionable improvement point 2",
    "Actionable improvement point 3"
  ]
}

Rules:
- improvements must contain 3 to 5 actionable and encouraging bullet points.
- Avoid harsh or negative language.
- Do not include emojis.
- Return only the JSON object, no extra text.

IMPORTANT: Respond ONLY in valid JSON. Do not include any explanations, markdown backticks, or extra text.
`;

export const FEEDBACK_PROMPT = `
{{conversation}}

Evaluate the candidate's interview performance based on the provided conversation.

Return ONLY valid JSON in the following structure:

{
  "score": 7.5,
  "rating": {
    "technicalSkills": 5,
    "communication": 6,
    "problemSolving": 4,
    "experience": 7
  },
  "summary": "The candidate showed decent experience and communication skills, but had weaknesses in problem-solving and technical depth.",
  "recommendation": "Not Recommended",
  "recommendationMsg": "The candidate may need more technical training before being considered for hire.",
  "questions": [
    {
      "question": "Question text here",
      "userAnswer": "Candidate's response here",
      "feedback": "AI feedback for this specific answer",
      "rating": 7
    }
  ]
}

Rules:
- score must be a number between 0 and 10 (max 1 decimal).
- rating values must be numbers between 0 and 10.
- summary must be ONE paragraph (2–3 sentences).
- recommendation must be exactly "Recommended" or "Not Recommended".
- recommendationMsg must be ONE sentence.
- questions must contain every question asked during the interview with the candidate's answer and specific feedback.
- Do NOT include extra text, markdown, or explanations.

IMPORTANT: Return ONLY the JSON object.
`;
;