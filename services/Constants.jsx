// services/Constants.jsx

import { LayoutDashboard, List, CreditCard, BriefcaseBusinessIcon, LayoutBriefcaseBusinessIcon, Code2Icon, Puzzle, User2Icon , Star, Calendar, Settings, Phone } from "lucide-react"

export const SideBarOptions = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard"
  },
  {
    name: "Schedule Interview",
    icon: Calendar,
    path: "/schedule-interview",
  },
  {
    name: "All Interview",
    icon: List,
    path: "/all-interviews",
  },
    {
    name: "All Phone Screenings",
    icon: Phone,
    path: "/all-phone-screenings",
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
interviewQuestions = [
  {
    question: "",
    type: "Technical/Behavioral/Experience/Problem Solving/Leadership"
  },
  {
    ...
  }
]

The goal is to create a structured, relevant, and time-optimized interview plan for a {{jobTitle}} role.
`;

export const FEEDBACK_PROMPT = `
{{conversation}}
Based on the above interview conversation between assistant and user,
evaluate the candidate's performance.

Return a JSON object with this exact structure and property names:

{
  "feedback": {
    "overallScore": 7,

    "rating": {
      "technicalSkills": 5,   
      "communication": 6,
      "problemSolving": 4,
      "experience": 7         
    },

    "summary": " ",<in 3 lines>
    "Recommendation": "Yes",   
    "RecommendationMsg": "Short sentence explaining whether to hire or not." 
  }
}

Rules:
- overallScore is a number from 0 to 10.  
- Each rating field is a number from 0 to 10.
- summary must be an array of exactly 3 short sentences. 
- Recommendation must be either "Yes" or "No".
- RecommendationMsg is one short sentence explaining the decision.

Return only valid JSON, no extra text.
`
;