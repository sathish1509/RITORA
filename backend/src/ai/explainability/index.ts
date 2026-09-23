import {
  UserHealthSnapshot,
  BaselineResult,
  PatternResult,
  WhatChangedResult,
  SymptomAnalysisResult,
  LifestyleAnalysisResult,
  RiskScreeningItem,
  EvidenceContract,
} from '../types';

/**
 * Explainable AI Engine
 * Assembles structured, traceable Evidence Contracts explaining WHY specific health insights,
 * pattern flags, or alerts were triggered by the intelligence pipeline.
 */
export function buildExplainabilityEvidence(
  snapshot: UserHealthSnapshot,
  baseline: BaselineResult,
  pattern: PatternResult,
  whatChanged?: WhatChangedResult,
  symptomAnalysis?: SymptomAnalysisResult,
  lifestyleAnalysis?: LifestyleAnalysisResult,
  riskScreening?: RiskScreeningItem[]
): EvidenceContract[] {
  const evidence: EvidenceContract[] = [];

  // -------------------------------------------------------------
  // 1. Cycle Length & Deviation Evidence
  // -------------------------------------------------------------
  const baselineLen = Math.round(baseline.meanCycleLength || 28);
  const dev = pattern.deviationDays;
  const cycleSignificance: 'NORMAL' | 'NOTICEABLE' | 'SIGNIFICANT' =
    Math.abs(dev) >= 5 ? 'SIGNIFICANT' : Math.abs(dev) >= 3 ? 'NOTICEABLE' : 'NORMAL';

  evidence.push({
    metric: 'Cycle Length Progression',
    baselineValue: `${baselineLen} days`,
    currentValue: `Day ${pattern.currentCycleDay}`,
    difference: `${dev >= 0 ? '+' : ''}${dev} days`,
    unit: 'days',
    significance: cycleSignificance,
    explanation:
      dev === 0
        ? `Cycle timing aligns exactly with your historical average of ${baselineLen} days.`
        : `Current cycle is ${Math.abs(dev)} days ${dev > 0 ? 'longer' : 'shorter'} than your personal historical baseline of ${baselineLen} days.`,
  });

  // -------------------------------------------------------------
  // 2. Sleep Duration Evidence
  // -------------------------------------------------------------
  if (lifestyleAnalysis) {
    const sleepDelta = lifestyleAnalysis.sleepDelta ?? 0;
    const histSleep = lifestyleAnalysis.historicalAvgSleep ?? 7.5;
    const sleepSignificance: 'NORMAL' | 'NOTICEABLE' | 'SIGNIFICANT' =
      sleepDelta <= -1.5 || lifestyleAnalysis.avgSleep7Days < 5.8
        ? 'SIGNIFICANT'
        : lifestyleAnalysis.sleepDeficit
        ? 'NOTICEABLE'
        : 'NORMAL';

    if (lifestyleAnalysis.sleepDeficit || Math.abs(sleepDelta) >= 0.8) {
      evidence.push({
        metric: 'Nightly Sleep Duration',
        baselineValue: `${histSleep.toFixed(1)} hrs`,
        currentValue: `${lifestyleAnalysis.avgSleep7Days.toFixed(1)} hrs`,
        difference: `${sleepDelta >= 0 ? '+' : ''}${sleepDelta.toFixed(1)} hrs`,
        unit: 'hours/night',
        significance: sleepSignificance,
        explanation: `7-day average sleep of ${lifestyleAnalysis.avgSleep7Days.toFixed(1)} hrs shows a ${Math.abs(sleepDelta).toFixed(1)} hr ${sleepDelta < 0 ? 'deficit' : 'increase'} compared to your ${histSleep.toFixed(1)} hr baseline.`,
      });
    }
  }

  // -------------------------------------------------------------
  // 3. Stress Elevation Evidence
  // -------------------------------------------------------------
  if (lifestyleAnalysis && (lifestyleAnalysis.isElevatedStress || lifestyleAnalysis.highStressDaysCount >= 2)) {
    const stressCount = lifestyleAnalysis.highStressDaysCount;
    const stressSignificance: 'NORMAL' | 'NOTICEABLE' | 'SIGNIFICANT' =
      stressCount >= 4 ? 'SIGNIFICANT' : 'NOTICEABLE';

    evidence.push({
      metric: 'Elevated Stress Frequency',
      baselineValue: '≤ 1 day/week',
      currentValue: `${stressCount} of 7 days`,
      difference: `+${Math.max(0, stressCount - 1)} days`,
      unit: 'days',
      significance: stressSignificance,
      explanation: `High or very-high stress levels were recorded across ${stressCount} of the past 7 days, coinciding with recent cycle timing.`,
    });
  }

  // -------------------------------------------------------------
  // 4. Hydration Deficit Evidence
  // -------------------------------------------------------------
  if (lifestyleAnalysis && lifestyleAnalysis.hydrationBelowTarget) {
    const hydDelta = lifestyleAnalysis.hydrationDelta ?? -0.4;
    const hydSignificance: 'NORMAL' | 'NOTICEABLE' | 'SIGNIFICANT' =
      lifestyleAnalysis.avgHydration7Days < 1.5 ? 'SIGNIFICANT' : 'NOTICEABLE';

    evidence.push({
      metric: 'Daily Hydration Intake',
      baselineValue: '2.0 L',
      currentValue: `${lifestyleAnalysis.avgHydration7Days.toFixed(1)} L`,
      difference: `${hydDelta >= 0 ? '+' : ''}${hydDelta.toFixed(1)} L`,
      unit: 'liters/day',
      significance: hydSignificance,
      explanation: `Daily fluid intake averaged ${lifestyleAnalysis.avgHydration7Days.toFixed(1)} L, falling below the 2.0 L recommended baseline.`,
    });
  }

  // -------------------------------------------------------------
  // 5. Symptom Recurrence Evidence
  // -------------------------------------------------------------
  if (symptomAnalysis && symptomAnalysis.topSymptoms.length > 0) {
    const recurring = symptomAnalysis.topSymptoms.filter(
      (s) => s.pattern === 'recurring' || s.averageSeverity >= 3.5 || s.isIncreasing
    );

    for (const sym of recurring.slice(0, 2)) {
      const symName = sym.symptomType.charAt(0).toUpperCase() + sym.symptomType.slice(1);
      evidence.push({
        metric: `Symptom Pattern: ${symName}`,
        baselineValue: 'Mild / Occasional',
        currentValue: `${sym.averageSeverity.toFixed(1)}/5 severity`,
        difference: `${Math.round(sym.frequency * 100)}% cycle recurrence`,
        unit: 'severity (1-5)',
        significance: sym.averageSeverity >= 4.0 ? 'SIGNIFICANT' : 'NOTICEABLE',
        explanation: `${symName} appeared in ${Math.round(sym.frequency * 100)}% of tracked cycles with ${sym.isIncreasing ? 'increasing' : 'stable'} severity.`,
      });
    }
  }

  // -------------------------------------------------------------
  // 6. Clinical Risk Awareness Evidence
  // -------------------------------------------------------------
  if (riskScreening && riskScreening.length > 0) {
    for (const risk of riskScreening) {
      evidence.push({
        metric: `Awareness Screen: ${risk.type}`,
        baselineValue: 'Standard Profile',
        currentValue: `${risk.level.toUpperCase()} awareness`,
        difference: 'Pattern Detected',
        unit: 'level',
        significance: risk.level === 'high' ? 'SIGNIFICANT' : 'NOTICEABLE',
        explanation: risk.explanation,
      });
    }
  }

  return evidence;
}
