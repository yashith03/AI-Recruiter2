import {
  Mic,
  CalendarClock,
  Scale,
  BatteryWarning,
  Brain,
  Timer,
  Link2,
  BarChart3,
  Lock,
  Database,
} from "lucide-react"

export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "Use cases", href: "#use" },
]

export const PROBLEMS = [
  {
    icon: CalendarClock,
    title: "Scheduling delays",
    text: "Email back-and-forth wastes days before interviews even start.",
  },
  {
    icon: Scale,
    title: "Biased evaluations",
    text: "Human judgment changes with mood, fatigue, and context.",
  },
  {
    icon: BatteryWarning,
    title: "Recruiter burnout",
    text: "Repeating the same screening calls drains productivity.",
  },
]

export const SOLUTIONS_FEATURES = [
  "Available 24/7 across all time zones",
  "Consistent, unbiased scoring",
  "Scale to thousands instantly",
]

export const FEATURES = [
  { icon: Mic, title: "AI voice interviews", description: "Powerful modules designed to streamline your entire recruitment pipeline with precision." },
  { icon: Timer, title: "Time controls", description: "Powerful modules designed to streamline your entire recruitment pipeline with precision." },
  { icon: Link2, title: "Shareable links", description: "Powerful modules designed to streamline your entire recruitment pipeline with precision." },
  { icon: BarChart3, title: "Candidate analytics", description: "Powerful modules designed to streamline your entire recruitment pipeline with precision." },
  { icon: Lock, title: "Enterprise security", description: "Powerful modules designed to streamline your entire recruitment pipeline with precision." },
  { icon: Database, title: "Supabase backend", description: "Powerful modules designed to streamline your entire recruitment pipeline with precision." },
]

export const STEPS = [
  { number: "1", title: "Create interview", text: "Efficiency at every milestone of the journey." },
  { number: "2", title: "Share link", text: "Efficiency at every milestone of the journey." },
  { number: "3", title: "AI interviews candidate", text: "Efficiency at every milestone of the journey." },
  { number: "4", title: "Review results", text: "Efficiency at every milestone of the journey." },
]

export const USE_CASES = [
  { title: "Startups", text: "Built to scale interviews without extra effort, ensuring quality is never compromised." },
  { title: "Remote teams", text: "Built to scale interviews without extra effort, ensuring quality is never compromised." },
  { title: "High-volume hiring", text: "Built to scale interviews without extra effort, ensuring quality is never compromised." },
  { title: "Technical roles", text: "Built to scale interviews without extra effort, ensuring quality is never compromised." },
]
