import { LifestyleRecord, LifestyleAnalysisResult } from '../types';

/**
 * Helper to check if a stress string qualifies as elevated
 */
function isHighStress(stress: string | undefined): boolean {
  if (!stress) return false;
  const s = stress.toLowerCase().trim();
  return s === 'high' || s === 'very-high' || s === 'very_high' || s === 'severe';
}

/**
 * Lifestyle Pattern & Comparative Delta Engine
 * Calculates rolling 7-day averages and contrasts them against historical baseline records.
 */
export function analyzeLifestylePatterns(lifestyle: LifestyleRecord[]): LifestyleAnalysisResult {
  // Edge Case: No lifestyle records logged yet
  if (!lifestyle || lifestyle.length === 0) {
    return {
      avgSleep7Days: 8.0,
      sleepDeficit: false,
      highStressDaysCount: 0,
      isElevatedStress: false,
      avgHydration7Days: 2.0,
      hydrationBelowTarget: false,
      historicalAvgSleep: 8.0,
      sleepDelta: 0,
      historicalAvgHydration: 2.0,
      hydrationDelta: 0,
      historicalHighStressDays: 0,
      stressDeltaDays: 0,
    };
  }

  // Records are sorted descending by date
  const recent7 = lifestyle.slice(0, 7);
  const historical = lifestyle.slice(7);

  // 1. Sleep Metrics & Delta
  const recentSleepSum = recent7.reduce((sum, l) => sum + (typeof l.sleep === 'number' ? l.sleep : 7.5), 0);
  const avgSleep7Days = Math.round((recentSleepSum / recent7.length) * 10) / 10;

  const historicalSleepSum = historical.length > 0
    ? historical.reduce((sum, l) => sum + (typeof l.sleep === 'number' ? l.sleep : 7.5), 0)
    : 7.5;
  const historicalAvgSleep = Math.round((historical.length > 0 ? historicalSleepSum / historical.length : 7.5) * 10) / 10;

  const sleepDelta = Math.round((avgSleep7Days - historicalAvgSleep) * 10) / 10;
  // Sleep deficit if 7-day average is below 6.8h or has dropped by >= 1.0h vs baseline
  const sleepDeficit = avgSleep7Days < 6.8 || sleepDelta <= -1.0;

  // 2. Stress Metrics & Delta
  const highStressDaysCount = recent7.filter((l) => isHighStress(l.stress)).length;

  const historicalHighCount = historical.filter((l) => isHighStress(l.stress)).length;
  // Normalize historical high stress count to a 7-day scale for fair comparison
  const historicalHighStressDays = historical.length > 0
    ? Math.round((historicalHighCount / historical.length) * 7 * 10) / 10
    : 1.0;

  const stressDeltaDays = Math.round((highStressDaysCount - historicalHighStressDays) * 10) / 10;
  // Elevated stress if >= 3 high-stress days in the past 7 days, or a noticeable jump vs history
  const isElevatedStress = highStressDaysCount >= 3 || stressDeltaDays >= 2.0;

  // 3. Hydration Metrics & Delta
  const recentHydrationSum = recent7.reduce((sum, l) => sum + (typeof l.hydration === 'number' ? l.hydration : 2.0), 0);
  const avgHydration7Days = Math.round((recentHydrationSum / recent7.length) * 10) / 10;

  const historicalHydrationSum = historical.length > 0
    ? historical.reduce((sum, l) => sum + (typeof l.hydration === 'number' ? l.hydration : 2.0), 0)
    : 2.0;
  const historicalAvgHydration = Math.round((historical.length > 0 ? historicalHydrationSum / historical.length : 2.0) * 10) / 10;

  const hydrationDelta = Math.round((avgHydration7Days - historicalAvgHydration) * 10) / 10;
  // Below target if under standard 2.0L minimum
  const hydrationBelowTarget = avgHydration7Days < 2.0;

  return {
    avgSleep7Days,
    sleepDeficit,
    highStressDaysCount,
    isElevatedStress,
    avgHydration7Days,
    hydrationBelowTarget,
    historicalAvgSleep,
    sleepDelta,
    historicalAvgHydration,
    hydrationDelta,
    historicalHighStressDays,
    stressDeltaDays,
  };
}
