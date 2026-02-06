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

###  Development Server

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

## 🌐 Deployment & CI/CD

This project is configured for automated deployment using **Vercel** and **GitHub Actions** for Docker.

### 🐳 Docker Support

The application is dockerized for production using a multi-stage, highly optimized build process.

- **Build Output:** Standalone (minimal footprint)
- **Base Image:** `node:20-alpine`
 - **Build Output:** Standalone (minimal footprint)
 - **Base Image:** `node:20-slim` (runtime installs Chromium system libraries required by Puppeteer)

#### Run with Docker Locally:

1. Build the image:
   ```bash
   docker build -t ai-recruiter2 .
   ```
2. Run the container:
   ```bash
   docker run -p 3000:3000 ai-recruiter2
   ```

If you need to test an image pulled from Docker Hub, replace `YOUR_DOCKERHUB_USER` and run:

```bash
docker pull YOUR_DOCKERHUB_USER/ai-recruiter2:latest
docker run --rm -p 3000:3000 YOUR_DOCKERHUB_USER/ai-recruiter2:latest
```

### 🚀 GitHub Actions CI/CD

Every push to the `main` branch triggers:
1. **Linting & Testing:** Ensures code quality and stability.
2. **Docker Build & Push:** Automatically builds a production Docker image and pushes it to Docker Hub.

#### Required GitHub Secrets:

To enable automated Docker builds, add the following secrets in **Settings > Secrets and variables > Actions**:

- `DOCKER_USERNAME`: Your Docker Hub username.
- `DOCKER_PASSWORD`: Your Docker Hub token/password.

Notes about CI behavior and scanning:

- The GitHub Actions workflow tags images by branch name and by commit SHA. The workflow only tags `latest` when the `main` branch is pushed.
- The pipeline runs a Trivy vulnerability scan against the SHA-tagged image. The workflow uses `aquasecurity/trivy-action`.

If your organization blocks third-party Actions, allowlist the actions used by the workflow or contact your admin. Common actions used:

- `actions/checkout`
- `docker/setup-buildx-action`
- `docker/login-action`
- `docker/build-push-action`
- `aquasecurity/trivy-action`

Alternative registry: you can switch the workflow to push to GitHub Container Registry (GHCR) instead of Docker Hub — GHCR can use `GITHUB_TOKEN` and avoids creating a separate Docker token.

### 🔗 Live Application

- **Vercel:** [https://ai-recruiterapp.vercel.app](https://ai-recruiterapp.vercel.app)

### 🛡️ Security Policy

This project enforces container vulnerability scanning using **Trivy** within the CI/CD pipeline.

- **Actionable Enforcement:** The pipeline is configured to fail builds only on **fixable HIGH and CRITICAL vulnerabilities** (using the `--ignore-unfixed` flag).
- **Non-Actionable Issues:** OS-level or framework vulnerabilities without a current upstream fix are tracked and mitigated via periodic base image updates rather than blocking releases.
- **Industry Standards:** This approach ensures a secure environment without introducing false blockers for non-actionable security disclosures.



---
