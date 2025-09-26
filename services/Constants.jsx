// services/Constants.jsx

import { LayoutDashboard, List, CreditCard, BriefcaseBusinessIcon, LayoutBriefcaseBusinessIcon, Code2Icon, Puzzle, User2Icon , Star, Calendar, Settings,  } from "lucide-react"

export const SideBarOptions = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard"
  },
  {
    name: "Schedule Interview",
    icon: Calendar,
    path: "/schedule",
  },
  {
    name: "All Interview",
    icon: List,
    path: "/interviews",
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