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
  { icon: Mic, title: "AI voice interviews" },
  { icon: Timer, title: "Time controls" },
  { icon: Link2, title: "Shareable links" },
  { icon: BarChart3, title: "Candidate analytics" },
  { icon: Lock, title: "Enterprise security" },
  { icon: Database, title: "Supabase backend" },
]

export const STEPS = [
  { number: "1", text: "Create interview" },
  { number: "2", text: "Share link" },
  { number: "3", text: "AI interviews candidate" },
  { number: "4", text: "Review results" },
]

export const USE_CASES = [
  { title: "Startups" },
  { title: "Remote teams" },
  { title: "High-volume hiring" },
  { title: "Technical roles" },
]
