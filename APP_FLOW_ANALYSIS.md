# AI Recruiter App - Flow Analysis

## 📌 Overview
**AI Recruiter** is a Next.js 16 web application designed to streamline recruitment through AI-powered voice interviews. The app follows a client-server architecture with Supabase for authentication and data persistence.

---

## 🏗️ Architecture Overview

### Core Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** JavaScript/React 18
- **Authentication:** Supabase Auth (OAuth - Google)
- **UI Library:** Radix UI Components
- **Styling:** Tailwind CSS
- **AI Integration:** Vapi AI (voice conversations), OpenAI
- **Database:** Supabase
- **Testing:** Jest + React Testing Library

---

## 🔄 App Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    LANDING PAGE (/)                         │
│  - Marketing site with features, how it works, use cases    │
│  - Nav with "Log in" & "Sign up" buttons → /auth            │
└──────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                   AUTH FLOW (/auth)                          │
│  - Google OAuth Sign In                                      │
│  - Redirects to /auth/callback (Supabase handles)            │
│  - User auto-saves to DB (upsert on users table)             │
└──────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│              AUTHENTICATED APP (/(main)/...)                 │
│  DashboardLayout (Sidebar + Content Area)                   │
│                                                              │
│  ├─ /dashboard (Default Landing)                            │
│  │  ├─ WelcomeContainer (User greeting)                    │
│  │  ├─ CreateOptions (Interview type selector)             │
│  │  └─ LatestInterviewsList (Recent interviews)            │
│  │                                                           │
│  ├─ /dashboard/create-interview (Interview Setup)           │
│  │  ├─ Phone Screening Path                                │
│  │  ├─ Technical Interview Path                            │
│  │  ├─ Behavioral Interview Path                           │
│  │  └─ Other Interview Types                               │
│  │                                                           │
│  ├─ /interview/[interview_id] (Interview Session)           │
│  │  ├─ Vapi AI Voice Integration                           │
│  │  ├─ Real-time Q&A with AI                               │
│  │  └─ Response Recording                                   │
│  │                                                           │
│  ├─ /all-interviews (Interview History)                     │
│  ├─ /all-phone-screenings (Phone Screening History)         │
│  ├─ /schedule-interview (Interview Scheduling)              │
│  ├─ /billing (Subscription & Credits)                       │
│  └─ /settings (User Settings)                               │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication & Context Flow

### 1. **Root Layout** (`app/layout.js`)
- Wraps entire app with `Provider` component
- Initializes Toaster (notifications) and Speed Insights
- Sets up global fonts (Outfit)

### 2. **Provider Component** (`app/provider.jsx`)
The **heart** of authentication and user state management.

#### State Management
```javascript
user === undefined → Still loading auth
user === null      → Not logged in
user !== null      → Logged in (object with email, name, picture)
```

#### Key Functions
- **loadUser()**: Initial auth check via `supabase.auth.getUser()`
- **saveUserToDB()**: Upserts user to "users" table after login
- **onAuthStateChange()**: Listens for login/logout events
- **formatName()**: Capitalizes user names

#### Context Provided
```javascript
<UserDetailContext.Provider value={{ user, setUser }}>
```

### 3. **Auth Page** (`app/auth/page.jsx`)
- Shows if `user === undefined` (loading) or `user === null` (not logged in)
- Contains Google OAuth button
- Auto-redirects to `/dashboard` if already logged in

**Flow:**
```
Click "Sign in with Google" 
  ↓
supabase.auth.signInWithOAuth({ provider: 'google' })
  ↓
Redirects to Google auth → Completes → /auth/callback
  ↓
Provider catches auth state change
  ↓
User saved to DB
  ↓
Auto-redirect to /dashboard
```

---

## 🎨 Main App Layout (After Auth)

### DashboardLayout Structure (`app/(main)/layout.js`)
```
DashboardProvider
  ├─ SidebarProvider (Radix UI)
  │  ├─ AppSidebar
  │  │  ├─ Logo & "Create New Interview" button
  │  │  ├─ Navigation Menu (from Constants.SideBarOptions)
  │  │  │  ├─ Dashboard
  │  │  │  ├─ Schedule Interview
  │  │  │  ├─ All Interview
  │  │  │  ├─ All Phone Screenings
  │  │  │  ├─ Billing
  │  │  │  └─ Settings
  │  │  └─ User Footer (Avatar, Name, Email)
  │  │
  │  └─ Main Content Area
  │     └─ {children} (Page content)
```

---

## 📄 Key Pages & Features

### 1. **Dashboard** (`/dashboard`)
- **Components Used:**
  - `WelcomeContainer` - User greeting
  - `CreateOptions` - Interview type selector (Technical, Behavioral, etc.)
  - `LatestInterviewsList` - Recent interviews

### 2. **Create Interview** (`/dashboard/create-interview`)
- Form to create new interview
- Interview types selection:
  - Technical
  - Behavioral
  - Experience
  - Problem Solving
  - Leadership
  - Phone Screening (special path)
- Input fields:
  - Job Title
  - Job Description
  - Interview Duration
  - Interview Type

**API Integration:**
- Calls `/api/ai-model` to generate questions using OpenAI
- Uses prompt template from `Constants.QUESTIONS_PROMPT`

### 3. **Interview Session** (`/interview/[interview_id]`)
- **AI Voice Integration:** Vapi AI (`@vapi-ai/web` v2.5.2)
- Real-time voice conversation
- Questions displayed from AI
- Candidate responses recorded
- Live feedback during session

### 4. **Interview Details** (`/interview/[interview_id]/detail`)
- Post-interview summary
- Candidate feedback
- AI-generated analysis
- API: `/api/ai-feedback` for feedback generation

### 5. **Phone Screenings** (`/all-phone-screenings`)
- Alternative interview type
- Phone/voice-focused flow

### 6. **Billing** (`/billing`)
- Credits/subscription management
- Usage tracking

### 7. **Settings** (`/settings`)
- User profile configuration

---

## 🔌 API Routes

### 1. **`/api/ai-model`**
- **Purpose:** Generate interview questions
- **Input:**
  - Job Title
  - Job Description
  - Interview Duration
  - Interview Type
- **Output:** Array of interview questions (JSON)
- **AI:** OpenAI GPT model with custom prompt

### 2. **`/api/ai-feedback`**
- **Purpose:** Generate AI feedback on interview responses
- **Input:** Candidate responses, interview details
- **Output:** Feedback analysis and recommendations

---

## 📊 Data Flow & Context

### UserDetailContext (`context/UserDetailContext.jsx`)
```javascript
{
  user: {
    name: string,
    email: string,
    picture: string (URL)
  } | null | undefined,
  setUser: function
}
```

### InterviewDataContext (`context/interviewDataContext.jsx`)
- Created but details in dedicated context file
- Likely stores interview state during creation/execution

---

## 🛡️ State Management Summary

| Level | Tool | Purpose |
|-------|------|---------|
| **Global** | Supabase Auth | User authentication |
| **App Root** | UserDetailContext | User info across app |
| **Main App** | DashboardProvider | Layout & sidebar state |
| **Page Level** | React State + Contexts | Interview-specific data |

---

## 🔀 Route Protection

**Pattern:** 
- `/` (Landing) → Unauthenticated
- `/auth` → Shows auth page only if NOT logged in
- `/(main)/*` → Protected by auth (Provider checks user state)

**Auth Check in Provider:**
```javascript
if (user === undefined) return null // Loading
if (user === null) redirect to /auth // Not logged in
// Otherwise show authenticated app
```

---

## 📦 Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| next | ^16.0.7 | Framework |
| react | 18.2.0 | UI Library |
| @supabase/supabase-js | ^2.57.4 | Database & Auth |
| @vapi-ai/web | ^2.5.2 | Voice AI |
| openai | ^6.1.0 | Question generation |
| @radix-ui/* | Various | UI Components |
| tailwind-merge | ^3.3.1 | CSS utilities |
| sonner | ^2.0.7 | Toast notifications |
| axios | ^1.12.2 | HTTP requests |

---

## 🧪 Testing Setup

- **Framework:** Jest 30.2.0
- **Library:** React Testing Library
- **Coverage:** Enabled (Jest coverage reports in `/coverage`)
- **Test Files Location:** `/__tests__/`

**Test Patterns Found:**
- Provider auth flow tests
- Auth page tests
- Component snapshot tests
- User context tests

---

## 🚀 Build & Deployment

- **Build Command:** `npm run build`
- **Dev Command:** `npm run dev`
- **Production:** `npm start`
- **Deployment:** Vercel (Speed Insights integrated)

---

## ✅ Known Flow Checkpoints

1. ✅ Landing page renders correctly
2. ✅ Auth flow (Google OAuth) works
3. ✅ User saved to Supabase after login
4. ✅ Context provides user state across app
5. ✅ Sidebar navigation routes correctly
6. ✅ Interview creation flow initialized
7. ✅ API routes for AI features ready
8. ✅ Vapi AI integration for voice conversations
9. ✅ Test coverage in place

---

## ⚠️ Potential Flow Issues to Check

1. **Protected Routes:** Verify `/(main)` routes properly redirect unauthenticated users
2. **Auth Callback:** Ensure `/auth/callback` is properly handled by Supabase
3. **Interview Data Persistence:** Verify interview data saves to Supabase correctly
4. **API Rate Limiting:** Check OpenAI/Vapi calls don't exceed quotas
5. **Mobile Responsiveness:** Test sidebar/nav on mobile devices
6. **Error Handling:** Check error boundary in main layout for API failures

---

## 📝 Summary

The **AI Recruiter** app follows a clear, modern Next.js pattern:
- **Entry:** Landing page or direct auth check
- **Auth:** Supabase OAuth (Google)
- **State:** User context + Supabase session
- **Main App:** Sidebar-based layout with multiple interview-related pages
- **AI Features:** OpenAI for questions, Vapi AI for voice interviews
- **Data:** Supabase for storage and auth

The flow is straightforward: **Land → Authenticate → Dashboard → Create Interview → Conduct Interview → Get Feedback**
