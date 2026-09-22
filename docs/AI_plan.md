# RITORA — AI Developer Implementation Plan & Handoff Guide

**Target Audience:** AI / ML / Backend Developer  
**Associated Technical Spec:** [`docs/AI_pipeline.md`](./AI_pipeline.md)  
**Location in Codebase:** `backend/src/ai/`  
**Status:** Scaffolding Complete & Ready for Implementation  

---

## 1. Executive Summary

This document serves as the implementation plan and developer guide for building out the AI subsystem of RITORA. 

The scaffolding under `backend/src/ai/` has been set up with modular boundaries, standardized TypeScript DTO contracts, and a clean separation between data fetching and pure algorithmic logic.

### Core Principle: Pure Functional Processing
- **Database Decoupling:** AI modules under `backend/src/ai/<module>/` **must not** import Prisma or query the database directly.
- **Input:** All engines receive a pure data snapshot (`UserHealthSnapshot`) or sub-records.
- **Output:** All engines return typed result contracts (e.g., `BaselineResult`, `PredictionResult`, `EvidenceContract[]`).
- **Testing:** You can write unit tests using static mock JSON objects without starting an SQLite/Prisma instance.

---

## 2. Directory Architecture

```text
backend/src/ai/
├── index.ts                      # Master Orchestrator (runAIPipeline, evaluateUserHealthSnapshot)
├── types.ts                      # Universal DTOs, evidence schemas, and engine contracts
├── dataPreparation.ts           # Prisma DB fetcher & data cleansing layer
│
├── baseline/                     # 1. Personal Menstrual Baseline Engine
│   ├── baselineEngine.ts
│   └── index.ts
│
├── cycle-prediction/             # 2. Next Period & Window Prediction Engine
│   ├── predictionEngine.ts
│   └── index.ts
│
├── cycle-pattern/                # 3. Cycle Pattern & Deviation Detection Engine
│   ├── patternEngine.ts
│   └── index.ts
│
├── what-changed/                 # 4. "What Changed?" Baseline Comparison Engine
│   ├── whatChangedEngine.ts
│   └── index.ts
│
├── symptom-analysis/             # 5. Symptom Frequency & Trend Engine
│   ├── symptomEngine.ts
│   └── index.ts
│
├── lifestyle-analysis/           # 6. Sleep, Stress & Hydration Analysis Engine
│   └── index.ts
│
├── risk-screening/               # 7. Non-Diagnostic Health Risk Awareness Engine
│   └── index.ts
│
├── explainability/               # 8. Structured Evidence Contract Engine
│   └── index.ts
│
├── insight-generation/           # 9. Explainable User-Facing Insight Generator
│   └── index.ts
│
├── recommendations/              # 10. Actionable Lifestyle Recommendation Engine
│   └── index.ts
│
├── alerts/                       # 11. Priority Smart Alert Engine
│   └── index.ts
│
├── assistant/                    # 12. RITORA AI Assistant & Gemini LLM Integration
│   └── index.ts
│
└── reports/                      # 13. Weekly / Cycle Health Summary Report Generator
    └── index.ts
```

---

## 3. Data Contracts & Evidence Schema

All interfaces are located in [`backend/src/ai/types.ts`](../backend/src/ai/types.ts).

### Evidence Contract Specification
Every generated insight or alert should link to structured evidence:

```typescript
export interface EvidenceContract {
  metric: string;               // e.g. "Cycle Length", "Nightly Sleep"
  baselineValue: number | string; // e.g. "28 days", "8.0 hrs"
  currentValue: number | string;  // e.g. "Day 34", "6.2 hrs"
  difference: number | string;    // e.g. "+6 days", "-1.8 hrs"
  unit: string;                 // e.g. "days", "hours"
  significance: 'NORMAL' | 'NOTICEABLE' | 'SIGNIFICANT';
  explanation: string;
}
```

---

## 4. Module-by-Module Implementation Guide

### Phase 1: Core Mathematical & Statistical Engines (Must-Have)

#### 1. Baseline Engine (`ai/baseline/`)
- **Objective:** Calculate mean cycle length, median, standard deviation, and data quality confidence score ($0–100\%$).
- **Algorithm:**
  - Filter out active/incomplete cycles.
  - Calculate $\mu$ (mean) and $\sigma$ (standard deviation) for cycle length and period duration.
  - Compute confidence score scaled by sample count (e.g., $1\text{ cycle} = 65\%$, $3+\text{ cycles} = 85\%$, $6+\text{ cycles} = 95\%$).

#### 2. Cycle Prediction Engine (`ai/cycle-prediction/`)
- **Objective:** Estimate next period start date and prediction window ($\pm 2\text{ days}$).
- **Logic:**
  - If current cycle day exceeds baseline, dynamically adjust estimated start date and reduce confidence score proportionally.
  - Calculate `estimatedWindowStart` and `estimatedWindowEnd`.

#### 3. Cycle Pattern Detection (`ai/cycle-pattern/`)
- **Objective:** Detect cycle day progression, deviation against personal baseline, and phase classification (`REGULAR`, `DELAYED`, `EARLY`, `IRREGULAR`).

#### 4. "What Changed?" Engine (`ai/what-changed/`)
- **Objective:** Multi-metric comparison against baseline.
- **Metrics to compare:**
  - Cycle length delta.
  - 7-day average sleep delta vs. 8.0h baseline.
  - Elevated stress frequency (number of `high` / `very-high` stress days).
  - Hydration deficit vs. 2.0L minimum.
  - Symptom severity shifts (e.g. fatigue severity $\ge 4/5$).

---

### Phase 2: Behavioral & Risk Analytics

#### 5. Symptom Analysis Engine (`ai/symptom-analysis/`)
- **Objective:** Cluster symptoms by frequency, average severity, and trend trajectory (`isIncreasing`).

#### 6. Lifestyle Analysis Engine (`ai/lifestyle-analysis/`)
- **Objective:** Correlate lifestyle factors (sleep, stress, hydration, exercise) with cycle day and phase.

#### 7. Risk-Awareness Screening (`ai/risk-screening/`)
- **Objective:** Non-diagnostic screening for health patterns.
- **Rules:**
  - **Anemia Awareness:** Triggered by heavy flow + persistent high fatigue ($\ge 4/5$).
  - **Extended Delay Awareness:** Triggered by cycle day $\ge 38$ or deviation $\ge 10\text{ days}$.
  - **Disclaimer:** All risk items **must** include the mandatory non-diagnostic clinical disclaimer.

---

### Phase 3: Explainability, Insights & Assistant

#### 8. Explainability Engine (`ai/explainability/`)
- **Objective:** Assemble structured `EvidenceContract[]` for every metric deviation.

#### 9. Insight Generation (`ai/insight-generation/`)
- **Objective:** Format actionable, empathetic insights for the mobile and web dashboard.

#### 10. Recommendations & Alerts (`ai/recommendations/`, `ai/alerts/`)
- **Objective:** Output priority-ordered lifestyle adjustments (sleep hygiene, hydration, stress management) and non-alarmist smart alerts.

#### 11. Assistant & LLM Context Engine (`ai/assistant/`)
- **Objective:** Formulate structured context payloads for Gemini 1.5 Flash.
- **Fallback:** Deterministic rule-based assistant fallback if no API key is provided.

---

## 5. Medical Safety & Clinical Boundaries

When authoring AI prompts, insight summaries, or risk explanations, strictly adhere to the non-diagnostic clinical safety guidelines:

| Allowed Terminology (Awareness) | Prohibited Terminology (Diagnostic) |
|---|---|
| *"Pattern change detected"* | *"You have a cycle disorder"* |
| *"Associated with lifestyle factors"* | *"Stress caused your late period"* |
| *"Awareness indicator for anemia risk"* | *"You are diagnosed with anemia"* |
| *"Consider discussing with your healthcare provider"* | *"You need prescription medication"* |

---

## 6. How to Test Your AI Code

1. **Unit Testing:**
   Create `.test.ts` files alongside your modules (e.g. `baselineEngine.test.ts`). Feed static `UserHealthSnapshot` fixtures and assert exact mathematical properties.

2. **Full Pipeline Run:**
   Execute `runAIPipeline(userId)` from `backend/src/ai/index.ts` to inspect the unified `AIPipelineOutput` object.

3. **Verify Backend Build:**
   ```bash
   cd backend
   npm run build
   ```
