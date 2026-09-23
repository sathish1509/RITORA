# RITORA — AI-Powered Menstrual Health Intelligence

<div align="center">

![RITORA Banner](https://img.shields.io/badge/RITORA-Menstrual%20Health%20AI-4A245E?style=for-the-badge)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Google Gemini AI](https://img.shields.io/badge/Gemini%20AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)

**Understand Your Rhythm. Understand Your Health.**

*A unified AI health intelligence platform combining cycle prediction, lifestyle pattern analysis, risk screening, and exportable clinical reports.*

</div>

---

## 📖 Table of Contents

- [Platform Overview](#-platform-overview)
- [System Architecture](#-system-architecture)
- [Core Functional Modules](#-core-functional-modules)
  - [1. Intelligent Cycle & Phase Analytics](#1-intelligent-cycle--phase-analytics)
  - [2. Symptom & Lifestyle Correlation Engine](#2-symptom--lifestyle-correlation-engine)
  - [3. Predictive AI Risk Screening](#3-predictive-ai-risk-screening)
  - [4. Context-Aware AI Health Assistant](#4-context-aware-ai-health-assistant)
  - [5. Clinical Report Generator](#5-clinical-report-generator)
- [User Guide & Operational Workflows](#-user-guide--operational-workflows)
  - [Phase I: Account Onboarding & Baseline Setup](#phase-i-account-onboarding--baseline-setup)
  - [Phase II: Daily Health & Symptom Logging](#phase-ii-daily-health--symptom-logging)
  - [Phase III: Reviewing Insights & Pattern Deviation Alerts](#phase-iii-reviewing-insights--pattern-deviation-alerts)
  - [Phase IV: Utilizing the Health Assistant](#phase-iv-utilizing-the-health-assistant)
  - [Phase V: Exporting Doctor Summaries](#phase-v-exporting-doctor-summaries)
- [AI Intelligence Pipeline Specification](#-ai-intelligence-pipeline-specification)
- [API Data Model & Architecture](#-api-data-model--architecture)
- [Design System & UI Guidelines](#-design-system--ui-guidelines)
- [Privacy, Data Governance & Security](#-privacy-data-governance--security)
- [Developer Setup Guide](file:///f:/RITORA/SETUP_GUIDE.md)


---

## 🔬 Platform Overview

**RITORA** is a multi-platform menstrual health intelligence application designed to transition women's health tracking from passive logging to active, predictive health management. 

Traditional tracking applications only display calendar dates and average length calculations. RITORA introduces an analytical engine powered by Google Gemini AI and statistical baseline processing that evaluates:
1. **Cycle Deviations**: Identifying variations from personal baselines versus population averages.
2. **Multi-Variate Lifestyle Impact**: Analyzing how sleep deficit, stress levels, hydration, and exercise impact cycle regularity and symptom severity.
3. **Risk & Trend Screening**: Highlighting patterns such as persistent luteal phase shortening or heavy flow trends for clinical awareness.
4. **Physician Communication**: Translating personal tracking logs into standardized medical summaries ready for healthcare provider consultations.

---

## 🏗️ System Architecture

RITORA is structured as a modular, decoupled architecture supporting both Web SaaS and Mobile client interfaces through an Express REST API backend:

```
<<<<<<< HEAD
┌──────────────────────────────────┐        ┌──────────────────────────────────┐
│        RITORA Web SaaS           │        │       RITORA Mobile App          │
│   (React + Vite + Tailwind)      │        │    (React Native + Expo)         │
└────────────────┬─────────────────┘        └────────────────┬─────────────────┘
                 │                                           │
                 └───────────────────┬───────────────────────┘
                                     │ JSON REST API / HTTPS
                                     ▼
                      ┌─────────────────────────────┐
                      │    Express API Gateway      │
                      │  (TypeScript Node.js App)   │
                      └──────────────┬──────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
┌─────────────────┐        ┌──────────────────┐        ┌──────────────────┐
│  Authentication │        │ Statistical AI   │        │ Gemini LLM Engine│
│ (JWT & bcrypt)  │        │ Analytics Engine │        │ (@google/genai)  │
└────────┬────────┘        └────────┬─────────┘        └────────┬─────────┘
         │                          │                           │
         └──────────────────────────┼───────────────────────────┘
                                    ▼
                      ┌─────────────────────────────┐
                      │     Prisma ORM Layer        │
                      │    (Relational Storage)     │
                      └─────────────────────────────┘
=======
RITORA/
├── web/          → React SaaS Web Application
├── app/          → React Native Expo Mobile Application
├── backend/      → Node.js + Express API (Prisma ORM & Supabase PostgreSQL)
└── README.md     → Project Overview & Setup Instructions
```

---

## Backend Application (`/backend`)

### Tech Stack
- Node.js + Express + TypeScript
- Prisma ORM (Supabase PostgreSQL / SQLite support)
- Google Gemini AI (`@google/generative-ai`)
- JWT Authentication (`jsonwebtoken`, `bcryptjs`)
- CORS enabled for Web & Mobile clients

### Setup

```bash
cd backend
npm install

# Push Prisma schema to your Supabase PostgreSQL database
npx prisma db push

# Seed initial demo data (Sarah demo account)
npm run prisma:seed

# Start dev server
npm run dev
```

The API server starts at `http://localhost:3001` (Health check: `http://localhost:3001/api/health`).

### Environment Variables (`backend/.env`)

```env
PORT=3001
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
JWT_SECRET="ritora_secret_jwt_key_hackathon_demo_2026"
CORS_ORIGIN="http://localhost:5173,http://localhost:8081,http://localhost:3000,*"
GEMINI_API_KEY="your_gemini_api_key_here"
>>>>>>> ffc3a79 (feat: migrate backend database to Supabase PostgreSQL, fix mobile app type error, and update documentation)
```

---

## 🧩 Core Functional Modules

<<<<<<< HEAD
### 1. Intelligent Cycle & Phase Analytics
- **Dynamic Phase Mapping**: Automatically calculates the user's current phase (Menstrual, Follicular, Ovulatory, Luteal) based on historical cycle data and recorded start dates.
- **Baseline Engine**: Establishes a rolling personal average cycle length rather than forcing a rigid 28-day model.
- **Deviation Alerts**: Identifies cycle extensions (e.g., +6 days beyond baseline) or premature period starts and tags them with statistical confidence scores.
=======
### Tech Stack
- React 18 + TypeScript
- Vite
- Tailwind CSS v4
- React Router v7
- Lucide React (icons)
- Recharts (charts)
>>>>>>> ffc3a79 (feat: migrate backend database to Supabase PostgreSQL, fix mobile app type error, and update documentation)

### 2. Symptom & Lifestyle Correlation Engine
- **Multi-Factor Logging**: Tracks daily severity scores (1-5) across physical symptoms (cramps, flow intensity, headaches, bloating) and lifestyle factors (stress, sleep duration, hydration, exercise).
- **Correlation Analytics**: Cross-references high-stress spikes and sleep deficits with subsequent cycle delays or increased symptom severity.

### 3. Predictive AI Risk Screening
- **Pattern Screening**: Continuously monitors logs for indicators associated with hormonal fluctuations or irregularities.
- **Awareness Indicators**: Surfaces clinical awareness flags (e.g., *Sustained Menorrhagia Awareness*, *Stress-Induced Anovulatory Risk*) to encourage timely medical consultation.

<<<<<<< HEAD
### 4. Context-Aware AI Health Assistant
- **Personalized RAG Context**: Injects the user's recent cycle metrics, symptom logs, and lifestyle trends into the prompt context for the Gemini AI model.
- **Safe & Empathetic Guidance**: Provides evidence-based educational information, wellness recommendations, and symptom management techniques tailored to the user's current cycle phase.

### 5. Clinical Report Generator
- **Medical Report Synthesis**: Compiles complex historical data into structured 3-month, 6-month, or 12-month clinical summaries.
- **Doctor-Ready Export**: Formats reports with clear symptom trend charts, cycle variation histories, and key health indicators for clinical appointments.
=======
The dev server starts at `http://localhost:5173`.

### Environment Variables

Create `web/.env`:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

> While the backend is offline, the app seamlessly falls back to built-in mock data.
>>>>>>> ffc3a79 (feat: migrate backend database to Supabase PostgreSQL, fix mobile app type error, and update documentation)

---

## 📘 User Guide & Operational Workflows

<<<<<<< HEAD
### Phase I: Account Onboarding & Baseline Setup
1. **Account Registration**: Users sign up with an email and password or securely authenticate through the mobile app.
2. **Onboarding Survey**: The user completes an initial baseline questionnaire specifying:
   - Average cycle length (if known).
   - Typical period duration.
   - Primary health focus (e.g., Cycle Regularity, Symptom Tracking, General Wellness).
   - Last known period start date.
=======
### Tech Stack
- React Native + TypeScript
- Expo (SDK 57)
- Expo Router (file-based routing)
>>>>>>> ffc3a79 (feat: migrate backend database to Supabase PostgreSQL, fix mobile app type error, and update documentation)

### Phase II: Daily Health & Symptom Logging
1. **Cycle Updates**: When a new period starts, the user logs the date in the **Cycle** tab to update predictions.
2. **Daily Logging**: Users complete a quick 30-second log capturing:
   - **Symptoms**: Flow intensity (Light, Medium, Heavy), Cramps, Mood, Energy.
   - **Lifestyle**: Hours of sleep, stress level (Low, Moderate, High), hydration.

### Phase III: Reviewing Insights & Pattern Deviation Alerts
1. **Dashboard Overview**: The primary dashboard presents the current cycle day, active phase, and next predicted period.
2. **Insights Tab**: Users explore AI-generated pattern cards revealing lifestyle-health connections (e.g., *"High stress in Week 2 correlated with a 4-day cycle delay"*).

### Phase IV: Utilizing the Health Assistant
1. **Interactive Querying**: Users navigate to the **Assistant** tab to ask specific questions about their health.
2. **Contextual Answers**: The assistant analyzes the user's logged data to give tailored responses, such as explaining why fatigue might be elevated during their current luteal phase.

<<<<<<< HEAD
### Phase V: Exporting Doctor Summaries
1. **Report Selection**: Users select a timeframe (3, 6, or 12 months) in the **Reports** section.
2. **Export / Print**: The application generates a clean PDF report summarizing cycle stability, average flow duration, and frequent symptoms to share with their gynecologist or healthcare provider.

---

## 🧠 AI Intelligence Pipeline Specification

The RITORA AI engine operates through a dual-layer analysis pipeline:

```
[Raw Log Data] ──► [Layer 1: Rule Engine] ──► [Layer 2: Gemini AI Analysis] ──► [User Insights & Assistant]
  - Cycles           - Phase Calculation        - Correlation Explanations
  - Symptoms         - Baseline Deviations      - Empathetic Health Advice
  - Lifestyle        - Anomaly Flags            - Clinical Report Formatting
```

1. **Layer 1: Deterministic Engine**: Computes exact mathematical metrics (means, standard deviations, phase boundaries) to guarantee data accuracy.
2. **Layer 2: Generative Intelligence Layer**: Feeds calculated metrics into Google Gemini to generate natural language explanations, personalized lifestyle recommendations, and interactive responses.

---

## 📊 API Data Model & Architecture

The system standardizes data handling across all client applications via a unified RESTful data contract:

### Core Data Entities

- **User**: Authentication, baseline cycle preferences, and profile settings.
- **CycleEntry**: Start dates, end dates, computed length, and phase classification.
- **SymptomLog**: Daily recordings of physical and emotional symptoms with 1-5 severity scales.
- **LifestyleLog**: Daily sleep, stress, activity, and dietary logging.
- **InsightRecord**: AI-generated health observations, risk awareness indicators, and correlation findings.
- **ClinicalReport**: Generated diagnostic export summaries.

---

## 🎨 Design System & UI Guidelines

RITORA's visual interface is built around calm, therapeutic tones designed to lower cognitive strain and create a supportive environment:

| Color Token | Hex Value | Application |
| :--- | :--- | :--- |
| **Deep Plum** | `#4A245E` | Primary brand identity, key headings, active navigation |
| **Soft Lavender** | `#B89AD9` | Secondary accents, progress indicators, highlights |
| **Warm Ivory** | `#FAF8F4` | Soft application background base |
| **Soft Lilac** | `#EDE4F5` | Structural cards, container backgrounds, subtle borders |
| **Deep Charcoal** | `#24212A` | High-contrast readable body typography |
| **Muted Sage** | `#A8C3B0` | Positive health status indicators & balance metrics |
| **Warm Amber** | `#E5B96B` | Pattern deviation & awareness alerts |
=======
### Environment Variables

Create `app/.env`:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

---

## Mock Data & Demo Credentials

Both applications come pre-loaded with demo data for presentation testing.

### Demo Credentials

```text
Email: sarah@ritora.app
Password: demo1234
```

### Demo Story & Metrics

| Metric | Value |
|---|---|
| User Name | Sarah (Age 24) |
| Average Cycle | 29 days |
| Current Cycle | Day 35 (+6 days deviation) |
| Sleep Avg | 5.5 hrs (high stress) |

RITORA detects Sarah's cycle deviation (+6 days) alongside reported symptoms (heavy flow, fatigue, cramps) and sleep deficit, producing:
1. **"Pattern Change Detected"** — Flagged deviation from personal baseline.
2. **Lifestyle Correlation** — Sleep & stress factors linked to symptom flare-ups.
3. **Anemia Risk Indicator** — Awareness notification (non-diagnostic).

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check endpoint |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |
| GET | `/api/auth/me` | Get current user profile |
| GET | `/api/cycles` | Fetch cycle history |
| POST | `/api/cycles` | Create cycle entry |
| GET | `/api/symptoms` | Fetch logged symptoms |
| POST | `/api/symptoms` | Log new symptom |
| GET | `/api/lifestyle` | Fetch lifestyle metrics |
| POST | `/api/lifestyle` | Log lifestyle entry |
| GET | `/api/insights` | Fetch AI health insights & risk indicators |
| GET | `/api/insights/predictions` | Fetch cycle predictions |
| GET | `/api/reports` | Get generated health reports |

---

## Brand Identity & Design Tokens

| Token | Color | Hex Code |
|---|---|---|
| Deep Plum | Primary Accent | `#4A245E` |
| Soft Lavender | Secondary Accent | `#B89AD9` |
| Warm Ivory | Light Background | `#FAF8F4` |
| Soft Lilac | Card Highlight | `#EDE4F5` |
| Deep Charcoal | Primary Text | `#24212A` |
| Muted Sage | Status / Normal | `#A8C3B0` |
| Soft Amber | Warning / Deviation | `#E5B96B` |
>>>>>>> ffc3a79 (feat: migrate backend database to Supabase PostgreSQL, fix mobile app type error, and update documentation)

---

## 🔒 Privacy, Data Governance & Security

- **Strict Data Confidentiality**: Personal health logs are stored securely with encrypted database fields.
- **Medical Disclaimer**: RITORA is an informational and health intelligence tool designed for wellness self-awareness. It does not provide formal medical diagnoses and is intended to complement, not replace, professional healthcare advice.
- **JWT Session Security**: Client interactions use secure JSON Web Token authentication with expiration enforcement.

---
