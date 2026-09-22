# RITORA — AI Technical Specification

**Product:** RITORA  
**Domain:** Menstrual Health Intelligence  
**Document Type:** AI Technical Specification & Developer Handoff  
**Prototype Target:** 3-Day Prototype  
**Status:** Implementation Specification

---

# 1. Document Purpose

This document defines the complete technical specification for the RITORA AI subsystem.

The purpose of this document is to allow a separate developer or AI/ML engineer to implement the RITORA intelligence layer without needing to infer requirements from the frontend or product specification.

RITORA must not behave as a basic period tracker with a chatbot added on top.

The AI system should:

- Learn the user's personal menstrual baseline.
- Analyze new menstrual and lifestyle data against that baseline.
- Predict the user's next expected period window.
- Detect meaningful changes in cycle patterns.
- Identify recurring symptom patterns.
- Identify lifestyle patterns.
- Perform awareness-level health-risk screening.
- Explain why an insight was generated.
- Generate personalized recommendations.
- Provide smart alerts.
- Support a data-aware AI health assistant.
- Generate periodic summaries and reports.

The core intelligence pipeline is:

```text
User Data
    ↓
Personal Baseline
    ↓
AI Analysis Engine
    ├── Cycle Prediction
    ├── Cycle Pattern Detection
    ├── What Changed?
    ├── Symptom Pattern Analysis
    ├── Lifestyle Pattern Analysis
    └── Risk-Awareness Screening
    ↓
Explainable Insight Engine
    ↓
Recommendations
Alerts
AI Assistant
Reports
```

The AI system must primarily compare the user's current data against their own historical baseline rather than treating a generic population average as their normal.

---

# 2. Scope

## 2.1 Prototype Scope

The 3-day prototype must prioritize:

1. Personal baseline
2. Cycle prediction
3. Cycle pattern detection
4. "What Changed?" analysis
5. Symptom pattern analysis
6. Lifestyle pattern analysis
7. Risk-awareness screening
8. Explainable AI insight

These are the core MUST-HAVE capabilities defined by the RITORA specification.

## 2.2 Secondary Scope

If the core system is stable, implement:

- AI health assistant
- Personalized recommendations
- Smart alerts
- Weekly/monthly report

## 2.3 Future Scope

The architecture should allow future implementation of:

- Wearable integration
- Voice-based health logging
- Advanced ML models
- Clinical validation
- Federated/private ML
- Large-scale longitudinal learning

These are explicitly future-scope capabilities and should not block the prototype.

---

# 3. Core Design Principles

## 3.1 Personal Baseline First

RITORA should understand what is normal for an individual user before identifying deviations.

Example:

```text
Historical cycle lengths:
28, 29, 30, 29

Personal average:
29 days
```

The user's 29-day average becomes more relevant to RITORA than a generic 28-day assumption.

---

## 3.2 Observation Before Interpretation

The AI must first identify what happened in the user's logged data.

Example:

```text
Current cycle = 35 days
Personal average = 29 days
Deviation = +6 days
```

Only after this observation should the system generate an interpretation.

---

## 3.3 No Unsupported Causation

RITORA must not claim that one logged factor caused another.

Incorrect:

```text
Your stress caused your delayed period.
```

Correct:

```text
Your recent records show increased stress during the same period
as your longer-than-usual cycle.
```

The system may use phrases such as:

- "occurred during the same period"
- "may be associated"
- "worth monitoring"

The specification explicitly requires this distinction.

---

## 3.4 Awareness, Not Diagnosis

RITORA is an awareness and pattern-detection system.

It must never diagnose a medical condition.

Use:

```text
Pattern detected
Risk indicator
Awareness indicator
Repeated pattern detected
Consider monitoring
```

Do not use:

```text
You have anemia.
You have PCOS.
You have a hormonal disorder.
```

The system must clearly distinguish logged observations from AI interpretation.

---

# 4. AI System Architecture

## 4.1 High-Level Architecture

```text
                    ┌─────────────────────┐
                    │     User Data       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Data Preparation  │
                    │  Validation / Clean │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Personal Baseline   │
                    │      Engine         │
                    └──────────┬──────────┘
                               │
                               ▼
              ┌──────────────────────────────────┐
              │       AI Analysis Engine         │
              │                                  │
              │  ┌────────────────────────────┐  │
              │  │ Cycle Prediction           │  │
              │  │ Pattern Detection          │  │
              │  │ What Changed               │  │
              │  │ Symptom Analysis           │  │
              │  │ Lifestyle Analysis         │  │
              │  │ Risk Screening             │  │
              │  └────────────────────────────┘  │
              └────────────────┬─────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Explainability      │
                    │ Engine              │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Insight Generator   │
                    └──────────┬──────────┘
                               │
                ┌──────────────┼───────────────┐
                ▼              ▼               ▼
          Recommendations   Alerts       AI Assistant
                               │
                               ▼
                         Reports
```

---

# 5. AI Module Boundaries

The AI subsystem should be separated into independent modules.

```text
ai/
├── baseline/
├── cycle-prediction/
├── cycle-pattern/
├── what-changed/
├── symptom-analysis/
├── lifestyle-analysis/
├── risk-screening/
├── explainability/
├── insight-generation/
├── recommendations/
├── alerts/
├── assistant/
└── reports/
```

Each module should:

- Have a clearly defined input.
- Perform one logical responsibility.
- Produce structured output.
- Avoid directly manipulating UI state.
- Avoid embedding frontend-specific logic.
- Be independently testable.

---

# 6. Data Specification

## 6.1 Menstrual Data

The AI layer may consume:

| Field | Type | Description |
|---|---|---|
| periodStartDate | Date | Start date of period |
| periodEndDate | Date | End date of period |
| cycleLength | Integer | Number of days between period starts |
| periodDuration | Integer | Duration of period |
| flow | Enum | Light / Medium / Heavy |

---

## 6.2 Symptoms

Supported symptoms:

- Cramps
- Fatigue
- Headache
- Bloating
- Mood changes
- Acne
- Breast tenderness
- Nausea

The specification explicitly identifies these symptoms for pattern analysis.

Example:

```json
{
  "symptoms": [
    "fatigue",
    "cramps"
  ]
}
```

---

## 6.3 Lifestyle Data

Supported lifestyle information:

- Sleep
- Stress
- Hydration
- Exercise
- Mood
- Nutrition, optionally

The specification identifies these as inputs for lifestyle analysis.

Example:

```json
{
  "sleepHours": 5,
  "stressLevel": "high",
  "hydrationLevel": "low",
  "exerciseLevel": "medium",
  "mood": "low"
}
```

---

# 7. Personal Baseline Engine

## 7.1 Purpose

The Personal Baseline Engine establishes the user's historical normal.

It is the foundation for all personalization.

---

## 7.2 Baseline Metrics

The engine should calculate:

```text
Average cycle length
Typical period duration
Usual flow
Average sleep
Typical stress
Common symptoms
Symptom frequency
Lifestyle averages
```

Example:

```json
{
  "averageCycleLength": 29,
  "usualFlow": "medium",
  "averageSleepHours": 7,
  "usualStress": "medium",
  "commonSymptoms": [
    "cramps",
    "fatigue"
  ]
}
```

---

## 7.3 Baseline Calculation

For cycle length:

```text
averageCycleLength =
sum(historicalCycleLengths) /
numberOfValidCycles
```

Example:

```text
28 + 29 + 30 + 29
-----------------
        4

= 29 days
```

The prototype should use a simple statistical baseline.

Advanced models should not be required for the 3-day prototype.

---

## 7.4 Baseline Requirements

The implementation must define behavior for:

- No historical cycles.
- One historical cycle.
- Few historical cycles.
- Many historical cycles.
- Missing values.
- Invalid values.
- Inconsistent records.

If insufficient historical information exists, the system should clearly indicate that the baseline is limited rather than pretending that a strong personal baseline exists.

---

# 8. AI Cycle Prediction

## 8.1 Purpose

Predict the user's next expected period window using their own historical cycle data.

Inputs include:

- Previous period start dates
- Previous period end dates
- Historical cycle lengths
- Recent cycle variation
- Number of recorded cycles
- Cycle consistency
- Optional symptom information
- Optional lifestyle information



---

## 8.2 Prototype Approach

Use personalized statistical prediction.

For example:

```text
Historical cycles:

28
29
30
29

Average:

29 days
```

If the last period began on:

```text
1 September
```

the expected next period would be approximately:

```text
30 September
```

The actual implementation should generate an expected window rather than falsely representing the prediction as an exact date.

---

## 8.3 Output

Example:

```json
{
  "predictedCycleLength": 29,
  "expectedPeriodStart": "2026-09-30",
  "window": {
    "start": "2026-09-28",
    "end": "2026-10-02"
  },
  "confidence": "medium"
}
```

The exact confidence methodology must be documented by the implementing developer.

---

## 8.4 Future Model Support

The architecture should allow replacement of the statistical approach with:

- Random Forest
- Gradient Boosting
- XGBoost
- Time-series models

These are future modeling options identified in the source specification.

---

# 9. Cycle Pattern Detection

## 9.1 Purpose

Determine whether the current cycle meaningfully differs from the user's personal baseline.

---

## 9.2 Detection Categories

Detect:

- Longer cycle
- Shorter cycle
- Cycle-length variation
- Period-duration variation
- Flow changes
- Sudden changes
- Repeated changes
- Repeated irregularity



---

## 9.3 Example

Historical cycles:

```text
28
29
30
29
```

Personal average:

```text
29
```

Current cycle:

```text
35
```

Deviation:

```text
35 - 29 = +6 days
```

Output:

```text
Pattern Change Detected — your current cycle is 6 days longer than your personal average.
```

---

## 9.4 Structured Output

```json
{
  "patternDetected": true,
  "type": "cycle_length_deviation",
  "baselineValue": 29,
  "currentValue": 35,
  "deviation": 6,
  "direction": "longer",
  "message": "Your current cycle is 6 days longer than your personal average."
}
```

---

# 10. What Changed Engine

## 10.1 Purpose

The "What Changed?" engine compares the current cycle against the user's historical baseline and identifies major changes.

---

## 10.2 Comparison Dimensions

Compare:

```text
Cycle length
Period duration
Flow
Sleep
Stress
Fatigue
Symptoms
Hydration
Exercise
Mood
```

---

## 10.3 Example

### Baseline

```text
Cycle: 29 days
Sleep: 7 hours
Stress: Medium
Flow: Medium
Fatigue: Low
```

### Current

```text
Cycle: 35 days
Sleep: 5 hours
Stress: High
Flow: Heavy
Fatigue: High
```

### Detected changes

```text
Cycle: +6 days
Sleep: -2 hours
Stress: Medium → High
Flow: Medium → Heavy
Fatigue: Low → High
```

---

## 10.4 Output

```text
Your cycle is 6 days longer than your personal average.
You also reported reduced sleep, higher stress, heavier flow,
and increased fatigue.
```

The engine must not claim that stress or sleep caused the cycle change.

---

# 11. Symptom Pattern Analysis

## 11.1 Purpose

Identify recurring symptom patterns across cycles.

---

## 11.2 Frequency Calculation

Example:

```text
Last 4 cycles:

Cycle 1 → Fatigue
Cycle 2 → No fatigue
Cycle 3 → Fatigue
Cycle 4 → Fatigue
```

Frequency:

```text
3 / 4 cycles
```

Output:

```text
Recurring symptom pattern — fatigue has been reported in 3 of your last 4 cycles.
```



---

## 11.3 Output Schema

```json
{
  "symptom": "fatigue",
  "occurrences": 3,
  "cyclesAnalyzed": 4,
  "frequency": 0.75,
  "pattern": "recurring",
  "message": "Fatigue has been reported in 3 of your last 4 cycles."
}
```

---

# 12. Lifestyle Pattern Analysis

## 12.1 Purpose

Analyze cycle and symptom records alongside lifestyle information.

---

## 12.2 Inputs

```text
Sleep
Stress
Hydration
Exercise
Mood
Nutrition
```

---

## 12.3 Pattern Detection

Example:

```text
Baseline sleep = 7 hours
Current sleep = 5 hours

Baseline stress = Medium
Current stress = High

Baseline cycle = 29 days
Current cycle = 35 days
```

Possible output:

```text
Your recent records show reduced sleep and increased stress
alongside a longer-than-usual cycle.
```

The system must not convert this into a causal claim.

---

# 13. Risk Awareness Screening

## 13.1 Purpose

Identify combinations of reported factors that may warrant additional attention.

This is an awareness-level screening system.

It is not a diagnostic system.



---

# 14. Anemia-Risk Awareness

## 14.1 Potential Inputs

Analyze combinations of:

- Heavy menstrual flow
- Repeated fatigue
- Dizziness, if reported
- Weakness, if reported
- Repeated heavy-bleeding patterns



---

## 14.2 Example

Possible output:

```text
Moderate awareness indicator — your reported symptoms and
menstrual pattern may warrant additional attention.
```

Never:

```text
You have anemia.
```

If a numerical score is introduced, it must be called:

```text
RITORA Awareness Score
```

It must not be represented as a clinically validated diagnostic score.

---

# 15. Irregular-Cycle Awareness

## 15.1 Purpose

Detect repeated cycle variability.

Example:

```text
31
42
29
45
33
```

This indicates considerable variation compared with a stable historical pattern.

Output:

```text
Repeated cycle variability detected.
Your recent cycles show considerable variation compared with
your previous pattern.

If this continues, consider discussing the pattern with a
healthcare professional.
```

---

## 15.2 Prohibited Interpretation

Do not output:

```text
You may have PCOS.
```

Multiple factors can contribute to irregular menstrual patterns.



---

# 16. Explainable AI Engine

## 16.1 Purpose

Every important AI result must explain why it appeared.

---

## 16.2 Explanation Structure

Every explanation should contain:

```text
Insight
↓
Reason
↓
Baseline evidence
↓
Current evidence
↓
Historical evidence
↓
Safety note
```

---

## 16.3 Example

```text
Why did RITORA flag this pattern?

1. Your current cycle is 6 days longer than your personal average.
2. You reported heavy flow.
3. Fatigue was reported during this cycle.
4. Similar fatigue was recorded in previous cycles.

These observations are based on your logged data and are not a diagnosis.
```

This follows the explainability requirement in the RITORA specification.

---

# 17. Personalized Health Insight Generator

## 17.1 Purpose

Combine multiple AI outputs into a coherent personalized summary.

Instead of displaying:

```text
Alert 1
Alert 2
Alert 3
Alert 4
```

RITORA should generate a consolidated insight.

---

## 17.2 Example

```text
Your cycle pattern has changed this month.

Your current cycle is 35 days compared with your personal
average of 29 days.

You also reported higher stress, reduced sleep and increased
fatigue.

Your recent records show that fatigue has appeared more
frequently than in previous cycles.

Continue tracking your symptoms and cycle. If unusual changes
persist, consider consulting a healthcare professional.
```



---

# 18. AI Health Assistant

## 18.1 Purpose

Allow users to ask natural-language questions about their own RITORA data.

Supported prototype questions include:

```text
Why is my cycle longer this month?

What changed from last month?

What symptoms have I had recently?

How has my sleep changed?

Show me my recent cycle pattern.
```



---

## 18.2 Data-Aware Requirement

The assistant must answer using the user's actual RITORA records.

It must not invent:

- Cycle data
- Symptoms
- Lifestyle information
- Historical values
- Medical history

For the 3-day prototype, predefined intelligent responses are acceptable while keeping the service interface ready for a real AI API.

---

# 19. Personalized Recommendation Engine

Recommendations must be generated from actual user patterns rather than generic advice.

---

## 19.1 Low Sleep

Input:

```text
Recent sleep average is lower than historical records.
```

Recommendation:

```text
Your recent sleep average is lower than your previous records.
Consider maintaining a consistent sleep schedule based on your
individual needs.
```

---

## 19.2 Repeated Fatigue

Input:

```text
Fatigue repeatedly appears across recent cycles.
```

Recommendation:

```text
Fatigue has appeared repeatedly in recent cycles.
Continue tracking it and consider discussing persistent symptoms
with a healthcare professional.
```

---

## 19.3 Low Hydration

Input:

```text
Recent hydration records are lower than previous records.
```

Recommendation:

```text
Your recent hydration records are lower than your previous
entries. Consider maintaining adequate hydration based on your
individual needs.
```

These examples follow the specified recommendation behavior.

---

# 20. Smart Alerts

## 20.1 Alert Types

### Pattern Alert

```text
Your current cycle is longer than your recent personal average.
```

### Symptom Alert

```text
Fatigue has been reported repeatedly in recent cycles.
```

### Lifestyle Alert

```text
Your sleep has decreased compared with your recent baseline.
```

### Follow-up Alert

```text
You may want to continue tracking this pattern.
```



---

## 20.2 Alert Rules

Avoid:

- Alarmist wording
- Excessive notifications
- Duplicate notifications
- Unnecessary alerts
- Diagnostic statements

The system should notify the user only when the detected pattern is meaningful.

---

# 21. Weekly / Monthly AI Report

The report should summarize:

```text
Average cycle
Current cycle
Cycle variation
Most frequent symptoms
Sleep trend
Stress trend
Hydration
Lifestyle patterns
Detected pattern changes
Awareness indicators
Personalized guidance
```



---

# 22. Common AI Output Contract

Every AI module should return structured data.

Recommended structure:

```json
{
  "module": "cycle_pattern_detection",
  "status": "success",
  "detected": true,
  "severity": "moderate",
  "result": {},
  "insight": {},
  "evidence": [],
  "explanation": {},
  "safety": {
    "isDiagnostic": false,
    "disclaimerRequired": true
  }
}
```

The exact implementation may differ, but the architecture should preserve these conceptual fields.

---

# 23. Evidence Model

AI outputs should reference the data that caused the output.

Example:

```json
{
  "evidence": [
    {
      "metric": "cycleLength",
      "baseline": 29,
      "current": 35,
      "difference": 6
    },
    {
      "metric": "sleep",
      "baseline": 7,
      "current": 5,
      "difference": -2
    },
    {
      "metric": "stress",
      "baseline": "medium",
      "current": "high"
    }
  ]
}
```

This evidence should be used by the Explainability Engine.

---

# 24. AI Processing Pipeline

Every analysis request should conceptually follow:

```text
1. Receive user data

2. Validate data

3. Normalize data

4. Load personal baseline

5. Compare current records against baseline

6. Detect deviations

7. Detect recurring patterns

8. Run awareness screening

9. Collect supporting evidence

10. Generate explanation

11. Generate personalized insight

12. Generate recommendation/alert if required

13. Return structured AI result
```

---

# 25. Data Validation

Before AI processing, validate:

- Dates
- Cycle lengths
- Period duration
- Flow values
- Symptoms
- Sleep values
- Stress values
- Hydration values
- Optional lifestyle values

Invalid or incomplete data should not silently become valid data.

Example:

```text
cycleLength = -5
```

must be rejected.

---

# 26. Missing Data

The AI must explicitly account for missing information.

Example:

```text
Historical cycles:
29
30
null
28
```

The null value should not be treated as zero.

The baseline should be calculated from valid records only.

The system should preserve information about how much data was actually available.

---

# 27. Confidence

Confidence should reflect the amount and consistency of available data.

Possible prototype values:

```text
Low
Medium
High
```

Confidence must not be interpreted as medical certainty.

Example:

```text
Prediction confidence: Medium

Reason:
The prediction is based on four recorded cycles with moderate
cycle consistency.
```

---

# 28. AI vs Deterministic Logic

The prototype does not require an LLM for every component.

Prefer deterministic/statistical logic for:

```text
Cycle averages
Deviation calculations
Frequency calculations
Baseline calculation
Trend calculations
Threshold checks
Pattern detection
Risk-rule screening
```

An LLM can be used later for:

```text
Natural-language explanations
Personalized summaries
Conversational assistant
Report generation
```

This separation improves reproducibility and explainability.

---

# 29. Prototype Model Strategy

The 3-day prototype should prioritize a simple, explainable architecture.

Recommended:

```text
Statistical calculations
        +
Rule-based pattern detection
        +
Structured insight generation
        +
Optional LLM language layer
```

Do not introduce a complex ML model merely to label the system as "AI".

Advanced models should be introduced only when sufficient validated data exists.

The source specification explicitly places Random Forest, Gradient Boosting, XGBoost and time-series models in the future evolution of cycle prediction.

---

# 30. AI API Contract

The AI subsystem should expose independent service interfaces.

Suggested endpoints:

```http
POST /ai/baseline
POST /ai/cycle/predict
POST /ai/cycle/analyze
POST /ai/what-changed
POST /ai/symptoms/analyze
POST /ai/lifestyle/analyze
POST /ai/risk/screen
POST /ai/insights/generate
POST /ai/recommendations/generate
POST /ai/alerts/evaluate
POST /ai/assistant
POST /ai/report/generate
```

These are architectural recommendations for implementation and are not required to be literal REST endpoints if the application uses another service architecture.

---

# 31. Baseline API

## Request

```json
{
  "cycles": [],
  "symptoms": [],
  "lifestyle": []
}
```

## Response

```json
{
  "averageCycleLength": 29,
  "usualFlow": "medium",
  "averageSleepHours": 7,
  "usualStress": "medium",
  "commonSymptoms": [
    "cramps",
    "fatigue"
  ],
  "dataQuality": {
    "cyclesAvailable": 4,
    "confidence": "medium"
  }
}
```

---

# 32. Cycle Prediction API

## Request

```json
{
  "historicalCycles": [28, 29, 30, 29],
  "lastPeriodStart": "2026-09-01"
}
```

## Response

```json
{
  "predictedCycleLength": 29,
  "expectedPeriodWindow": {
    "start": "2026-09-28",
    "end": "2026-10-02"
  },
  "confidence": "medium",
  "evidence": {
    "historicalAverage": 29,
    "cyclesAnalyzed": 4
  }
}
```

---

# 33. Pattern Detection API

## Request

```json
{
  "baseline": {
    "averageCycleLength": 29
  },
  "currentCycle": {
    "cycleLength": 35
  }
}
```

## Response

```json
{
  "detected": true,
  "type": "cycle_length_deviation",
  "baseline": 29,
  "current": 35,
  "difference": 6,
  "direction": "longer"
}
```

---

# 34. What Changed API

## Request

```json
{
  "baseline": {
    "cycleLength": 29,
    "sleepHours": 7,
    "stress": "medium",
    "flow": "medium",
    "fatigue": "low"
  },
  "current": {
    "cycleLength": 35,
    "sleepHours": 5,
    "stress": "high",
    "flow": "heavy",
    "fatigue": "high"
  }
}
```

## Response

```json
{
  "changes": [
    {
      "metric": "cycleLength",
      "baseline": 29,
      "current": 35,
      "difference": 6
    },
    {
      "metric": "sleepHours",
      "baseline": 7,
      "current": 5,
      "difference": -2
    },
    {
      "metric": "stress",
      "baseline": "medium",
      "current": "high"
    }
  ]
}
```

---

# 35. AI Assistant Data Contract

The assistant should receive a structured context object.

```json
{
  "question": "Why is my cycle longer this month?",
  "userContext": {
    "baseline": {},
    "currentCycle": {},
    "recentCycles": [],
    "symptoms": [],
    "lifestyle": []
  }
}
```

The assistant should answer using this context.

It must not assume information that is absent from the context.

---

# 36. AI Database Entities

The AI subsystem may require derived entities such as:

```text
PersonalBaseline
AIAnalysis
PatternDetection
SymptomPattern
LifestylePattern
RiskIndicator
AIInsight
Recommendation
SmartAlert
AIReport
```

The exact database implementation may use separate tables or another persistence strategy.

The conceptual separation should remain.

---

# 37. PersonalBaseline Entity

Suggested fields:

```text
id
userId
averageCycleLength
typicalPeriodDuration
usualFlow
averageSleepHours
usualStress
commonSymptoms
baselinePeriod
dataQuality
createdAt
updatedAt
```

---

# 38. AIAnalysis Entity

Suggested fields:

```text
id
userId
analysisType
inputReference
result
evidence
confidence
createdAt
```

Possible `analysisType` values:

```text
cycle_prediction
cycle_pattern
what_changed
symptom_pattern
lifestyle_pattern
risk_screening
```

---

# 39. AIInsight Entity

Suggested fields:

```text
id
userId
analysisId
title
message
type
severity
evidence
explanation
createdAt
```

---

# 40. Safety Metadata

AI results should carry safety metadata.

Example:

```json
{
  "safety": {
    "isDiagnostic": false,
    "isClinicallyValidated": false,
    "requiresProfessionalGuidance": false
  }
}
```

For awareness indicators:

```json
{
  "safety": {
    "isDiagnostic": false,
    "isClinicallyValidated": false,
    "requiresProfessionalGuidance": true
  }
}
```

---

# 41. Testing Strategy

Each AI module must be independently tested.

Testing should include:

- Normal data
- Minimal data
- Missing data
- Invalid data
- Stable patterns
- Significant changes
- Repeated changes
- Conflicting records
- Boundary values
- Safety-sensitive patterns

---

# 42. Baseline Test Cases

### Test 1

Input:

```text
[28, 29, 30, 29]
```

Expected:

```text
Average = 29
```

### Test 2

Input:

```text
[30]
```

Expected:

```text
Baseline confidence = Low
```

### Test 3

Input:

```text
[]
```

Expected:

```text
No personal baseline available.
```

---

# 43. Pattern Detection Test

Input:

```text
Historical:
28, 29, 30, 29

Current:
35
```

Expected:

```text
Pattern detected = true
Deviation = +6 days
Direction = longer
```

---

# 44. Symptom Test

Input:

```text
Cycle 1: fatigue
Cycle 2: none
Cycle 3: fatigue
Cycle 4: fatigue
```

Expected:

```text
Fatigue frequency = 3 / 4
Pattern = recurring
```

---

# 45. Risk Awareness Test

Input:

```text
Heavy flow
+
Repeated fatigue
+
Repeated heavy bleeding
```

Expected:

```text
Awareness indicator
```

Not:

```text
Diagnosis
```

---

# 46. Causality Safety Tests

The system must fail safety validation if it generates statements such as:

```text
Stress caused your delayed period.
```

or:

```text
Poor sleep caused your irregular cycle.
```

Allowed:

```text
Higher stress occurred during the same period as the longer cycle.
```

---

# 47. Explainability Tests

For every important AI result:

```text
Insight must have evidence.
Evidence must reference available user data.
Explanation must not introduce unsupported facts.
```

If an explanation cannot be supported by logged data, it should not be generated as factual reasoning.

---

# 48. Medical Safety Rules

The following rules apply globally.

## Rule 1 — No Diagnosis

Never diagnose a disease.

---

## Rule 2 — No Causal Claims

Correlation or co-occurrence must not be presented as causation.

---

## Rule 3 — Use Awareness Language

Preferred:

```text
Risk indicator
Awareness indicator
Pattern detected
Repeated pattern detected
May be associated
Worth monitoring
```

---

## Rule 4 — No Unvalidated Clinical Scores

A prototype score must not be presented as a clinical score.

If used:

```text
RITORA Awareness Score
```

---

## Rule 5 — Professional Guidance

Persistent or concerning changes should be accompanied by appropriate guidance to consider professional medical consultation.

---

## Rule 6 — Separate Observation From Interpretation

Example:

```text
Observation:
Your current cycle is 35 days.

Interpretation:
This is 6 days longer than your personal average.

Awareness:
This pattern may be worth monitoring.
```

The specification explicitly establishes these medical-safety requirements.

---

# 49. Recommended AI Response Structure

For user-facing insights:

```text
Title

What we noticed:
<observation>

Compared with your baseline:
<comparison>

Why this appeared:
<evidence>

What you can do:
<monitoring / recommendation>

Safety note:
<appropriate disclaimer>
```

Example:

```text
Pattern Change Detected

What we noticed:
Your current cycle is 35 days.

Compared with your baseline:
Your personal average is 29 days, so the current cycle is
6 days longer.

Why this appeared:
Your recent cycle differs from your historical pattern.

What you can do:
Continue tracking your cycle and related symptoms.

Safety note:
These observations are based on your logged data and are not
a diagnosis.
```

---

# 50. Demo Scenario

The recommended demonstration should use one realistic user and show the complete pipeline.

Demo data:

```text
Personal average:
29 days

Current cycle:
35 days

Symptoms:
Heavy flow
Fatigue
Cramps

Lifestyle:
5 hours sleep
High stress
```

Expected processing:

```text
Personal baseline
        ↓
Current cycle = 35
        ↓
Deviation = +6 days
        ↓
Pattern Change Detected
        ↓
What Changed?
        ↓
Heavy flow + fatigue + cramps
        ↓
Lifestyle comparison
        ↓
Risk-awareness screening
        ↓
Explainable insight
        ↓
Personalized monitoring guidance
```

The source specification defines this scenario as the recommended prototype demonstration.

---

# 51. End-to-End Example

## Input

```json
{
  "baseline": {
    "averageCycleLength": 29,
    "averageSleepHours": 7,
    "usualStress": "medium",
    "usualFlow": "medium"
  },
  "currentCycle": {
    "cycleLength": 35,
    "flow": "heavy",
    "symptoms": [
      "fatigue",
      "cramps"
    ],
    "sleepHours": 5,
    "stress": "high"
  }
}
```

## Analysis

```text
Cycle deviation:
35 - 29 = +6 days

Sleep deviation:
5 - 7 = -2 hours

Stress:
medium → high

Flow:
medium → heavy
```

## Pattern Detection

```text
Cycle pattern change detected.
```

## Lifestyle Pattern

```text
Reduced sleep and increased stress occurred during the same
period as the longer-than-usual cycle.
```

## Symptom Pattern

If fatigue has occurred in previous cycles:

```text
Fatigue has appeared repeatedly in recent cycles.
```

## Awareness Screening

If the required combination is present:

```text
Moderate awareness indicator — your reported symptoms and
menstrual pattern may warrant additional attention.
```

## Final Insight

```text
Your cycle pattern has changed this month.

Your current cycle is 35 days compared with your personal
average of 29 days.

You also reported reduced sleep, higher stress, heavy flow,
and increased fatigue.

Fatigue has appeared repeatedly in your recent records.

Continue tracking these patterns. If unusual changes persist,
consider consulting a healthcare professional.
```

---

# 52. Separation of Responsibilities

The AI developer is responsible for:

```text
Data analysis
Baseline calculation
Prediction
Pattern detection
Risk-awareness logic
Evidence generation
AI insight generation
AI assistant logic
Recommendation generation
AI reports
AI API contracts
AI testing
```

The frontend developer is responsible for:

```text
Displaying insights
Displaying explanations
Charts
Notifications
User interactions
Dashboard
```

The backend/application developer is responsible for:

```text
Authentication
User data storage
API routing
Persistence
Integration
Authorization
```

The AI subsystem should not directly depend on UI components.

---

# 53. Explainability Requirement

No major AI feature should behave as a black box during the prototype.

For each insight, the developer should be able to answer:

```text
What did the system detect?

What baseline did it compare against?

What changed?

What data triggered the result?

Why was this particular message generated?
```

If these questions cannot be answered from structured system output, the feature should be considered incomplete.

---

# 54. Prototype Priority

## MUST HAVE

```text
Personal Baseline
Cycle Prediction
Cycle Pattern Detection
What Changed?
Symptom Pattern Analysis
Lifestyle Pattern Analysis
Risk-Awareness Screening
Explainable AI Insight
```

## NICE TO HAVE

```text
AI Health Assistant
Personalized Recommendations
Smart Alerts
Weekly/Monthly Report
```

## FUTURE

```text
Wearables
Voice Logging
Advanced ML
Clinical Validation
Federated ML
Longitudinal Learning
```



---

# 55. Future ML Architecture

The prototype should not lock RITORA into rule-based intelligence.

The architecture should allow:

```text
Prototype

Statistical Analysis
        +
Rule-Based Detection
        +
Structured NLP/LLM Layer

              ↓

Future

Machine Learning Models
        +
Time-Series Models
        +
Personalized Models
        +
Longitudinal Learning
```

Possible future models include:

- Random Forest
- Gradient Boosting
- XGBoost
- Time-series models

Advanced modeling should be introduced only when sufficient validated data is available.

---

# 56. Privacy and Data Handling Considerations

The AI architecture should treat menstrual and lifestyle records as sensitive personal data.

The implementation should therefore:

- Process only data necessary for the requested analysis.
- Avoid exposing one user's data to another user.
- Keep AI context scoped to the authenticated user.
- Avoid sending unnecessary personal data to external AI services.
- Avoid storing raw AI prompts when unnecessary.
- Clearly distinguish user records from generated interpretation.

Specific infrastructure/security requirements should be defined by the application's broader security architecture.

---

# 57. AI Module Completion Criteria

A module is considered complete only when:

```text
[ ] Input contract exists
[ ] Output contract exists
[ ] Validation exists
[ ] Normal case works
[ ] Missing data is handled
[ ] Invalid data is handled
[ ] Edge cases are tested
[ ] Evidence is produced
[ ] Explanation is produced
[ ] Safety rules are satisfied
[ ] Unit tests exist
[ ] Integration test exists
```

---

# 58. Final Architecture

The complete RITORA intelligence architecture is:

```text
                         USER DATA
                             │
                             ▼
                    DATA PREPARATION
                             │
                             ▼
                    PERSONAL BASELINE
                             │
                             ▼
                  ┌──────────────────────┐
                  │   AI ANALYSIS        │
                  │                      │
                  │ Cycle Prediction     │
                  │ Pattern Detection    │
                  │ What Changed         │
                  │ Symptom Analysis     │
                  │ Lifestyle Analysis   │
                  │ Risk Screening       │
                  └──────────┬───────────┘
                             │
                             ▼
                   EVIDENCE GENERATION
                             │
                             ▼
                  EXPLAINABILITY ENGINE
                             │
                             ▼
                  PERSONALIZED INSIGHT
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
       RECOMMENDATIONS     ALERTS       AI ASSISTANT
              │              │              │
              └──────────────┼──────────────┘
                             ▼
                         AI REPORTS
```

---

# 59. One-Sentence Product Definition

RITORA builds a personal menstrual-health baseline, analyzes cycle, symptom and lifestyle data against that baseline, detects meaningful changes and recurring patterns, provides awareness-level risk indicators, and explains its insights in a personalized way.

---

# 60. Final Developer Handoff

The developer implementing this subsystem should treat this document as the AI implementation boundary.

The implementation should prioritize:

```text
1. Personal Baseline
2. Cycle Prediction
3. Cycle Pattern Detection
4. What Changed?
5. Symptom Pattern Analysis
6. Lifestyle Pattern Analysis
7. Risk Awareness
8. Explainability
```

Then, if the core system is stable:

```text
9. Recommendations
10. Smart Alerts
11. AI Assistant
12. Reports
```

The prototype should favor **simple, deterministic, explainable analysis over unnecessarily complex machine-learning models**.

The central principle of RITORA is:

```text
User's historical data
        ↓
Personal baseline
        ↓
Current data
        ↓
Difference / pattern
        ↓
Evidence
        ↓
Explainable insight
        ↓
Personalized guidance
```

The AI must never cross the boundary from **health awareness and pattern detection** into **medical diagnosis**.

---

**RITORA — Understand Your Rhythm. Understand Your Health.**