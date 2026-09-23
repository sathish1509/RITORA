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

- Platform Overview
- System Architecture
- Core Functional Modules
  - Intelligent Cycle & Phase Analytics
  - Symptom & Lifestyle Correlation Engine
  - Predictive AI Risk Screening
  - Context-Aware AI Health Assistant
  - Clinical Report Generator
- User Guide & Operational Workflows
  - Phase I: Account Onboarding & Baseline Setup
  - Phase II: Daily Health & Symptom Logging
  - Phase III: Reviewing Insights & Pattern Deviation Alerts
  - Phase IV: Utilizing the Health Assistant
  - Phase V: Exporting Doctor Summaries
- AI Intelligence Pipeline Specification
- API Data Model & Architecture
- API Reference & Endpoints
- Design System & Brand Guidelines
- Privacy, Data Governance & Security
- Developer Setup Guide

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

RITORA is structured as a modular, decoupled architecture supporting both Web SaaS and Mobile client interfaces through an Express REST API backend connected to PostgreSQL / Supabase:

```
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
                      │   (Supabase PostgreSQL)     │
                      └─────────────────────────────┘
```

---

## 🧩 Core Functional Modules

### 1. Intelligent Cycle & Phase Analytics
- **Dynamic Phase Mapping**: Automatically calculates the user's current phase (Menstrual, Follicular, Ovulatory, Luteal) based on historical cycle data and recorded start dates.
- **Baseline Engine**: Establishes a rolling personal average cycle length rather than forcing a rigid 28-day model.
- **Deviation Alerts**: Identifies cycle extensions (e.g., +6 days beyond baseline) or premature period starts and tags them with statistical confidence scores.

### 2. Symptom & Lifestyle Correlation Engine
- **Multi-Factor Logging**: Tracks daily severity scores (1-5) across physical symptoms (cramps, flow intensity, headaches, bloating) and lifestyle factors (stress, sleep duration, hydration, exercise).
- **Correlation Analytics**: Cross-references high-stress spikes and sleep deficits with subsequent cycle delays or increased symptom severity.

### 3. Predictive AI Risk Screening
- **Pattern Screening**: Continuously monitors logs for indicators associated with hormonal fluctuations or irregularities.
- **Awareness Indicators**: Surfaces clinical awareness flags (e.g., *Sustained Menorrhagia Awareness*, *Stress-Induced Anovulatory Risk*) to encourage timely medical consultation.

### 4. Context-Aware AI Health Assistant
- **Personalized RAG Context**: Injects the user's recent cycle metrics, symptom logs, and lifestyle trends into the prompt context for the Gemini AI model.
- **Safe & Empathetic Guidance**: Provides evidence-based educational information, wellness recommendations, and symptom management techniques tailored to the user's current cycle phase.

### 5. Clinical Report Generator
- **Medical Report Synthesis**: Compiles complex historical data into structured 3-month, 6-month, or 12-month clinical summaries.
- **Doctor-Ready Export**: Formats reports with clear symptom trend charts, cycle variation histories, and key health indicators for clinical appointments.

---

## 📘 User Guide & Operational Workflows

### Phase I: Account Onboarding & Baseline Setup
1. **Account Registration**: Users sign up with an email and password or securely authenticate through the mobile app.
2. **Onboarding Survey**: The user completes an initial baseline questionnaire specifying:
   - Average cycle length (if known).
   - Typical period duration.
   - Primary health focus (e.g., Cycle Regularity, Symptom Tracking, General Wellness).
   - Last known period start date.

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

## 📡 API Reference & Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check & database connection status |
| `POST` | `/api/auth/register` | User registration & baseline creation |
| `POST` | `/api/auth/login` | User authentication & JWT issuance |
| `GET` | `/api/auth/me` | Retrieve current authenticated user profile |
| `GET` | `/api/cycles` | Fetch historical cycle entries |
| `POST` | `/api/cycles` | Create or update cycle start/end logs |
| `GET` | `/api/symptoms` | Fetch logged symptoms |
| `POST` | `/api/symptoms` | Log daily symptoms and severity ratings |
| `GET` | `/api/lifestyle` | Fetch recorded lifestyle logs |
| `POST` | `/api/lifestyle` | Log daily lifestyle metrics (sleep, stress, hydration) |
| `GET` | `/api/insights` | Fetch AI insights & risk screening indicators |
| `GET` | `/api/insights/predictions` | Fetch AI cycle predictions |
| `GET` | `/api/reports` | Retrieve generated clinical reports |

---

## 🎨 Design System & Brand Guidelines

RITORA's visual interface is built around calm, therapeutic tones designed to lower cognitive strain and create a supportive environment:

| Token Name | Application | Hex Value |
| :--- | :--- | :--- |
| **Deep Plum** | Primary brand identity, key headings, active navigation | `#4A245E` |
| **Soft Lavender** | Secondary accents, progress indicators, highlights | `#B89AD9` |
| **Warm Ivory** | Soft application background base | `#FAF8F4` |
| **Soft Lilac** | Structural cards, container backgrounds, subtle borders | `#EDE4F5` |
| **Deep Charcoal** | High-contrast readable body typography | `#24212A` |
| **Muted Sage** | Positive health status indicators & balance metrics | `#A8C3B0` |
| **Warm Amber** | Pattern deviation & awareness alerts | `#E5B96B` |

---

## 🔒 Privacy, Data Governance & Security

- **Medical Disclaimer**: RITORA is an informational and health intelligence tool designed for wellness self-awareness. It does not provide formal medical diagnoses and is intended to complement, not replace, professional healthcare advice.
- **JWT Session Security**: Client interactions use secure JSON Web Token authentication with expiration enforcement.
- **Encrypted Data Persistence**: Database queries and user health parameters are protected in isolated, authenticated data partitions.

---

## 🛠️ Developer Setup Guide

For developer setup instructions, local development commands, database migration steps, and container deployment guidelines, please refer to the standalone [SETUP_GUIDE.md](SETUP_GUIDE.md).

---

## 📄 License

Proprietary — Developed for Hackathon & Production Deployment. All rights reserved.
