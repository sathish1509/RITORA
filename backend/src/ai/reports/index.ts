import { AIPipelineOutput, UserHealthSnapshot } from '../types';

/**
 * Health Summary Report Generator
 * Assembles comprehensive clinical report data incorporating baseline metrics,
 * active cycle progression, longitudinal symptom recurrence, lifestyle factors,
 * and risk awareness indicators.
 */
export function generateHealthSummaryReport(
  snapshot: UserHealthSnapshot,
  pipelineOutput: AIPipelineOutput,
  reportType: string = 'monthly'
) {
  const { user, cycles, symptoms, lifestyle } = snapshot;
  const {
    baseline,
    prediction,
    pattern,
    whatChanged,
    symptomAnalysis,
    lifestyleAnalysis,
    riskScreening,
    recommendations,
  } = pipelineOutput;

  // 1. Cycle Calculations (Active vs Completed)
  const activeCycle = cycles.find((c) => c.isActive);
  const completedCycles = cycles.filter((c) => !c.isActive && c.cycleLength && c.cycleLength > 0);
  const cycleLengths = completedCycles.map((c) => c.cycleLength as number);

  const avgCycleLength = Math.round(
    baseline.meanCycleLength ||
      (cycleLengths.length > 0
        ? cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length
        : user.averageCycleLength || 28)
  );

  // Total cycles logged (including active cycle if present, minimum 1 if records exist)
  const totalCyclesLogged = cycles.length > 0 ? cycles.length : Math.max(1, completedCycles.length);

  // Consider current cycle day in longestCycle if currently extended past historical max
  const maxCompletedLength = cycleLengths.length > 0 ? Math.max(...cycleLengths) : avgCycleLength;
  const longestCycle = Math.max(
    maxCompletedLength,
    pattern.currentCycleDay > avgCycleLength ? pattern.currentCycleDay : avgCycleLength
  );
  const shortestCycle = cycleLengths.length > 0 ? Math.min(...cycleLengths) : avgCycleLength;

  // 2. Format Common Symptoms with Severity and Recurrence
  let commonSymptoms = symptomAnalysis.topSymptoms.map((s) => ({
    type: s.symptomType,
    count: s.occurrences || 1,
    averageSeverity: Number(s.averageSeverity.toFixed(1)),
    frequency: Math.round(s.frequency * 100),
    isIncreasing: s.isIncreasing,
    trendDescription: s.trendDescription || `${s.symptomType} reported with ${s.averageSeverity}/5 severity.`,
  }));

  // Fallback if top symptoms empty
  if (commonSymptoms.length === 0 && symptoms.length > 0) {
    const symptomMap: Record<string, { count: number; totalSev: number }> = {};
    for (const s of symptoms) {
      if (!symptomMap[s.type]) {
        symptomMap[s.type] = { count: 0, totalSev: 0 };
      }
      symptomMap[s.type].count += 1;
      symptomMap[s.type].totalSev += s.severity || 3;
    }
    for (const [type, info] of Object.entries(symptomMap).slice(0, 5)) {
      const avgSev = Number((info.totalSev / info.count).toFixed(1));
      commonSymptoms.push({
        type,
        count: info.count,
        averageSeverity: avgSev,
        frequency: Math.min(100, Math.round((info.count / Math.max(1, totalCyclesLogged)) * 100)),
        isIncreasing: false,
        trendDescription: `${type} recorded in ${info.count} log entries with ${avgSev}/5 avg severity.`,
      });
    }
  }

  // 3. Lifestyle Summary
  const avgSleep = Number((lifestyleAnalysis.avgSleep7Days || 7.5).toFixed(1));
  const avgHydration = Number((lifestyleAnalysis.avgHydration7Days || 2.0).toFixed(1));
  const avgExercise =
    lifestyle.length > 0
      ? Math.round(lifestyle.reduce((sum, e) => sum + (e.exercise || 0), 0) / lifestyle.length)
      : 25;

  const stressSummary = lifestyleAnalysis.isElevatedStress ? 'high' : 'moderate';

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const now = new Date();
  const currentMonthName = monthNames[now.getMonth()];
  const currentYear = now.getFullYear();

  const formattedType = reportType.charAt(0).toUpperCase() + reportType.slice(1);
  const title = `${formattedType} Health Summary — ${currentMonthName} ${currentYear}`;

  // 4. Formulate Detailed, Clinically Grounded Dynamic Summary
  const deviationSign = pattern.deviationDays >= 0 ? '+' : '';
  const deviationStr = `${deviationSign}${pattern.deviationDays} days`;

  let cycleNarrative = '';
  if (activeCycle) {
    cycleNarrative = `Current active cycle is progressing at Day ${pattern.currentCycleDay} (${pattern.phase || 'Luteal'} phase), exhibiting an active deviation of ${deviationStr} against personal baseline (${avgCycleLength} days across ${totalCyclesLogged} tracked cycles). Cycle status is ${pattern.status.toLowerCase()}${pattern.isDelayed ? ' with delayed ovulation timing indicated' : ''}.`;
  } else {
    cycleNarrative = `Tracked ${totalCyclesLogged} cycle records with a personal baseline of ${avgCycleLength} days (std dev: ±${Math.round(baseline.cycleLengthStdDev || 0)}d, current status: ${pattern.status.toLowerCase()}).`;
  }

  const sleepDeficitText = lifestyleAnalysis.sleepDeficit
    ? `an estimated sleep deficit of ${Math.abs(lifestyleAnalysis.sleepDelta || (7.8 - avgSleep)).toFixed(1)}h vs historical baseline`
    : 'consistent sleep patterns meeting restorative thresholds';

  const lifestyleNarrative = `Biometric evaluation over the rolling 7-day window indicates nightly sleep averaging ${avgSleep}h (${sleepDeficitText}), elevated stress recorded on ${lifestyleAnalysis.highStressDaysCount} of the past 7 days, and daily hydration averaging ${avgHydration}L.`;

  const symptomsNarrative =
    commonSymptoms.length > 0
      ? `Primary recorded symptoms: ${commonSymptoms
          .slice(0, 4)
          .map((s) => `${s.type} (${s.averageSeverity}/5 severity, ${s.frequency}% recurrence)`)
          .join(', ')}.`
      : 'No recurrent symptoms recorded during this evaluation timeframe.';

  const riskNarrative =
    riskScreening.length > 0
      ? `Active clinical awareness indicators: ${riskScreening
          .map((r) => `${r.type} (${r.level.toUpperCase()} awareness: ${r.explanation})`)
          .join('; ')}.`
      : 'No elevated risk awareness flags identified.';

  const whatChangedNarrative =
    whatChanged.hasSignificantChanges && whatChanged.changes.length > 0
      ? `Key baseline shifts: ${whatChanged.changes
          .slice(0, 3)
          .map((c) => `${c.metricName} (${c.recent} vs baseline ${c.baseline}, delta ${c.delta})`)
          .join('; ')}.`
      : '';

  const summary = [
    `Clinical Health Analysis (${currentMonthName} ${currentYear}):`,
    cycleNarrative,
    lifestyleNarrative,
    symptomsNarrative,
    riskNarrative,
    whatChangedNarrative,
    'Disclaimer: Synthesized observations are derived from user-logged biometric patterns to support informed healthcare provider discussions and do not constitute a medical diagnosis.',
  ]
    .filter(Boolean)
    .join(' ');

  // 5. Rich Report Data Structure
  const reportData = {
    cycleCount: totalCyclesLogged,
    completedCyclesCount: completedCycles.length,
    averageCycleLength: avgCycleLength,
    longestCycle,
    shortestCycle,
    currentCycleDay: pattern.currentCycleDay,
    deviationDays: pattern.deviationDays,
    cyclePhase: pattern.phase || 'LUTEAL',
    cycleStatus: pattern.status,
    activeCycle: {
      currentCycleDay: pattern.currentCycleDay,
      deviationDays: pattern.deviationDays,
      phase: pattern.phase || 'LUTEAL',
      phaseDescription: pattern.phaseDescription || 'Post-ovulatory phase',
      status: pattern.status,
      isDelayed: pattern.isDelayed,
      isEarly: pattern.isEarly,
    },
    commonSymptoms,
    lifestyleAverages: {
      sleep: avgSleep,
      stress: stressSummary,
      hydration: avgHydration,
      exercise: avgExercise,
      sleepDeficit: lifestyleAnalysis.sleepDeficit,
      sleepDelta: lifestyleAnalysis.sleepDelta,
      highStressDays: lifestyleAnalysis.highStressDaysCount,
      isElevatedStress: lifestyleAnalysis.isElevatedStress,
    },
    baseline: {
      meanCycleLength: baseline.meanCycleLength || avgCycleLength,
      cycleLengthStdDev: baseline.cycleLengthStdDev,
      confidenceScore: baseline.confidenceScore,
      meanPeriodDuration: baseline.meanPeriodDuration || 5,
      sampleSize: baseline.sampleSize || totalCyclesLogged,
    },
    prediction: {
      predictedStartDate: prediction.predictedStartDate,
      estimatedWindowStart: prediction.estimatedWindowStart,
      estimatedWindowEnd: prediction.estimatedWindowEnd,
      confidence: prediction.confidence,
      basedOn: prediction.basedOn,
    },
    whatChanged: whatChanged.changes.map((c) => ({
      category: c.category,
      metricName: c.metricName,
      baseline: c.baseline,
      recent: c.recent,
      delta: c.delta,
      direction: c.direction,
      description: c.description,
    })),
    riskScreening: riskScreening.map((r) => ({
      type: r.type,
      level: r.level,
      explanation: r.explanation,
      disclaimer: r.disclaimer,
      suggestedAction: r.suggestedAction,
    })),
    recommendations: recommendations.slice(0, 4).map((rec) => ({
      id: rec.id,
      category: rec.category,
      title: rec.title,
      suggestion: rec.suggestion,
      priority: rec.priority,
    })),
  };

  return {
    userId: user.id,
    title,
    type: reportType,
    summary,
    data: reportData,
    generatedAt: now.toISOString(),
  };
}
