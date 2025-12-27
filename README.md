# ✨ AI Recruiter

AI Recruiter is a web‑based platform designed to help users **create, schedule, manage, and conduct AI‑powered interviews**. It brings together a structured interview creation workflow, real‑time AI conversation, analytics, and a clean dashboard experience. The system is built with **Next.js (App Router)** and includes modern UI patterns, automated testing, and continuous deployment.

---

## 📌 Overview

AI Recruiter allows recruiters to:

* Create interviews with custom question sets 📝
* Generate shareable interview links 🔗
* Let candidates complete interviews through an **AI‑driven voice experience** 🎙️🤖
* Review responses, track progress, and manage multiple interview sessions through a unified dashboard 📊

The system includes an API documentation viewer, AI feedback routes, confirmation prompts, and a real‑time timer for active interviews. Each feature is modular and separated into clean components and pages for maintainability.

---

## ⭐ Key Features

### 🧩 Interview Creation

* Guided creation wizard ✨
* Automatic interview link generation 🔗
* Supports customisable question sets ✍️

### 📋 Interview Management

* Dashboard with recent and ongoing interviews 📌
* Detailed view for each interview, including candidate interactions 👤
* Scheduling support for organising sessions 📅

### 🎧 Live AI Interview Experience

* Real‑time voice interview powered by **Vapi** ⚡
* Timer component for tracking session length ⏱️
* Alerts and confirmation prompts for start/end actions 🔔
* Feedback collection at the end of each session 🗒️

### 📚 Documentation & API Integration

* In‑app API documentation viewer 📄
* Routes for AI model execution and feedback 🧠
* Supabase authentication integration 🔐

### 🎨 UI System

* Custom UI toolkit: buttons, dialogs, sheets, inputs, progress bars, tooltips, skeletons 🎛️
* Responsive sidebar navigation 📂
* Smooth loading states with skeleton components 💨

### 🧪 Testing & Quality

* Jest + React Testing Library test suite 🧪
* Coverage reporting 📈
* GitHub Actions workflow for automated CI and Vercel deployment 🚀

---

## 🏗️ Technology Stack

### 🎨 Frontend

* Next.js (App Router)
* React
* Tailwind CSS
* Radix UI primitives (customised components)

### 🔧 Backend (Within Next.js)

* API Routes for model and feedback processing
* Supabase authentication client

### 🤖 AI Integration

* Vapi SDK for AI‑powered interview conversations

### 🧪 Testing

* Jest
* React Testing Library

### ☁️ Deployment

* Vercel
* GitHub Actions CI workflow (`ci-vercel.yml`)

---

## 📂 Project Structure Summary

The folder structure is arranged to maintain clarity between pages, components, tests, and utilities.

### 📁 `app/`

Contains all App Router pages such as dashboard, interview flow, scheduling, auth, API routes, and documentation.

### 🎛️ `components/ui/`

Reusable UI elements: dialogs, buttons, sheets, inputs, tooltips, skeletons, etc.

### 🧩 `context/`

React context providers for user details and interview data.

### 🔧 `services/`

Supabase client and shared constants.

### 🧪 `__tests__/`

Coverage for pages, components, providers, and interview behaviour.

### 🖼️ `public/`

Static assets and the OpenAPI specification.

---

## 🚀 Getting Started

### 📦 Installation

```bash
npm install
```

### 🔐 Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_key_here
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### ▶️ Development Server

```bash
npm run dev
```

Visit: `http://localhost:3000`

---

## 🧪 Running Tests

### Run all tests

```bash
npm test
```

### Run tests with coverage

```bash
npm test -- --coverage
```

Test coverage includes:

* Dashboard and routing 🗂️
* Interview creation flow 📝
* AI interview behaviour 🎙️
* API responses 🔧
* UI and layout rendering 🎨

---

## 🌐 Deployment

Deployment is handled through **Vercel**, with GitHub Actions for automated build, test, and deployment.

### Live Application

🔗 [https://ai-recruiterapp.vercel.app](https://ai-recruiterapp.vercel.app)



---
