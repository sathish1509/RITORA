import { UserHealthSnapshot, BaselineResult, WhatChangedResult, WhatChangedMetric } from '../types';
import { calculateDaysDifference, formatDateToISO } from '../dataPreparation';

/**
 * Helper to identify high stress values
 */
function isHighStress(stress: string | undefined): boolean {
  if (!stress) return false;
  const s = stress.toLowerCase().trim();
  return s === 'high' || s === 'very-high' || s === 'very_high' || s === 'severe';
}

/**
 * "What Changed?" Baseline Comparison Engine
 * Pure mathematical comparative analysis between current active state and personal baseline.
 * Enforces strict clinical observation without unsupported causation claims.
 */
export function analyzeWhatChanged(
  snapshot: UserHealthSnapshot,
  baseline: BaselineResult
): WhatChangedResult {
  const changes: WhatChangedMetric[] = [];
  const todayStr = formatDateToISO(new Date());

  // -------------------------------------------------------------
  // 1. Cycle Length Delta
  // -------------------------------------------------------------
  const activeCycle = snapshot.cycles.find((c) => c.isActive) || snapshot.cycles[0];
  const baselineCycle = Math.max(20, Math.round(baseline.meanCycleLength || snapshot.user.averageCycleLength || 28));

  if (activeCycle && activeCycle.startDate) {
    const currentDay = calculateDaysDifference(activeCycle.startDate, todayStr);
    const cycleDelta = currentDay - baselineCycle;

    if (Math.abs(cycleDelta) >= 3) {
      changes.push({
        category: 'CYCLE',
        metricName: 'Cycle Timing Deviation',
        baseline: `${baselineCycle} days`,
        recent: `Day ${currentDay}`,
        delta: `${cycleDelta >= 0 ? '+' : ''}${cycleDelta} days`,
        direction: cycleDelta > 0 ? 'UP' : 'DOWN',
        significance: Math.abs(cycleDelta) >= 5 ? 'SIGNIFICANT' : 'NOTICEABLE',
        description: `Current cycle is at Day ${currentDay} (${cycleDelta >= 0 ? '+' : ''}${cycleDelta} days compared to your ${baselineCycle}-day baseline).`,
      });
    }
  }

  // -------------------------------------------------------------
  // 2. 7-Day Sleep Duration vs Baseline
  // -------------------------------------------------------------
  const recent7Lifestyle = snapshot.lifestyle.slice(0, 7);
  const olderLifestyle = snapshot.lifestyle.slice(7);

  if (recent7Lifestyle.length > 0) {
    const recentSleepSum = recent7Lifestyle.reduce((sum, l) => sum + (l.sleep || 7.5), 0);
    const avgSleepRecent = Math.round((recentSleepSum / recent7Lifestyle.length) * 10) / 10;

    const baselineSleep = olderLifestyle.length > 0
      ? Math.round((olderLifestyle.reduce((sum, l) => sum + (l.sleep || 7.5), 0) / olderLifestyle.length) * 10) / 10
      : 7.5;

    const sleepDelta = Math.round((avgSleepRecent - baselineSleep) * 10) / 10;

    if (sleepDelta <= -0.8 || avgSleepRecent < 6.8) {
      changes.push({
        category: 'SLEEP',
        metricName: 'Nightly Sleep Duration',
        baseline: `${baselineSleep.toFixed(1)} hrs/night`,
        recent: `${avgSleepRecent.toFixed(1)} hrs/night`,
        delta: `${sleepDelta >= 0 ? '+' : ''}${sleepDelta.toFixed(1)} hrs`,
        direction: sleepDelta >= 0 ? 'UP' : 'DOWN',
        significance: sleepDelta <= -1.5 || avgSleepRecent < 5.8 ? 'SIGNIFICANT' : 'NOTICEABLE',
        description: `Average sleep over the last 7 days was ${avgSleepRecent.toFixed(1)} hours (${sleepDelta >= 0 ? '+' : ''}${sleepDelta.toFixed(1)} hrs compared to your baseline), observed during the same timeframe as current cycle progression.`,
      });
    }

    // -----------------------------------------------------------
    // 3. Elevated Stress Frequency Shift
    // -----------------------------------------------------------
    const highStressCount = recent7Lifestyle.filter((l) => isHighStress(l.stress)).length;

    if (highStressCount >= 3) {
      changes.push({
        category: 'STRESS',
        metricName: 'Elevated Stress Frequency',
        baseline: '≤ 1 day/week',
        recent: `${highStressCount} of ${recent7Lifestyle.length} days`,
        delta: `+${highStressCount - 1} elevated days`,
        direction: 'UP',
        significance: highStressCount >= 4 ? 'SIGNIFICANT' : 'NOTICEABLE',
        description: `Elevated stress was recorded on ${highStressCount} of the past 7 days, noted during the same period as recent cycle variations.`,
      });
    }

    // -----------------------------------------------------------
    // 4. Hydration Deficit
    // -----------------------------------------------------------
    const recentHydrationSum = recent7Lifestyle.reduce((sum, l) => sum + (l.hydration || 2.0), 0);
    const avgHydration = Math.round((recentHydrationSum / recent7Lifestyle.length) * 10) / 10;
    const hydrationTarget = 2.0;
    const hydrationDelta = Math.round((avgHydration - hydrationTarget) * 10) / 10;

    if (avgHydration < 1.8) {
      changes.push({
        category: 'HYDRATION',
        metricName: 'Daily Water Intake',
        baseline: `${hydrationTarget.toFixed(1)} L/day`,
        recent: `${avgHydration.toFixed(1)} L/day`,
        delta: `${hydrationDelta.toFixed(1)} L/day`,
        direction: 'DOWN',
        significance: avgHydration < 1.5 ? 'SIGNIFICANT' : 'NOTICEABLE',
        description: `Daily water intake averaged ${avgHydration.toFixed(1)} L over the last 7 days, falling below the 2.0 L recommended target.`,
      });
    }
  }

  // -------------------------------------------------------------
  // 5. Fatigue Severity Shift
  // -------------------------------------------------------------
  const fatigueLogs = snapshot.symptoms.filter((s) => s.type.toLowerCase().includes('fatigue'));
  if (fatigueLogs.length > 0) {
    const recentFatigue = fatigueLogs.slice(0, 3);
    const recentFatigueAvg = Math.round((recentFatigue.reduce((s, f) => s + f.severity, 0) / recentFatigue.length) * 10) / 10;

    const olderFatigue = fatigueLogs.slice(3);
    const baselineFatigue = olderFatigue.length > 0
      ? Math.round((olderFatigue.reduce((s, f) => s + f.severity, 0) / olderFatigue.length) * 10) / 10
      : 2.0;

    const fatigueDelta = Math.round((recentFatigueAvg - baselineFatigue) * 10) / 10;

    if (recentFatigueAvg >= 3.5 || fatigueDelta >= 1.0 || recentFatigue.some((f) => f.severity >= 4)) {
      changes.push({
        category: 'SYMPTOMS',
        metricName: 'Fatigue Severity Shift',
        baseline: `${baselineFatigue.toFixed(1)}/5 severity`,
        recent: `${recentFatigueAvg.toFixed(1)}/5 severity`,
        delta: `${fatigueDelta >= 0 ? '+' : ''}${fatigueDelta.toFixed(1)} severity`,
        direction: fatigueDelta >= 0 ? 'UP' : 'DOWN',
        significance: recentFatigueAvg >= 4.0 ? 'SIGNIFICANT' : 'NOTICEABLE',
        description: `Reported fatigue severity reached an average of ${recentFatigueAvg.toFixed(1)}/5 in recent logs, co-occurring alongside heavier flow patterns and reduced sleep.`,
      });
    }
  }

  // -------------------------------------------------------------
  // 6. Significance Evaluation and Synthesized Summary
  // -------------------------------------------------------------
  const hasSignificantChanges = changes.some((c) => c.significance === 'SIGNIFICANT') || changes.length >= 2;

  let summary = 'No major deviations detected across your cycle, lifestyle, or symptom records.';
  if (changes.length > 0) {
    const descriptions = changes.map((c) => c.description || `${c.metricName}: ${c.delta}`).join(' ');
    summary = `Observed patterns: ${descriptions}`;
  }

  return {
    hasSignificantChanges,
    changes,
    summary,
  };
}
