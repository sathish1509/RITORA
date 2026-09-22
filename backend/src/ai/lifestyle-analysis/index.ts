import { LifestyleRecord, LifestyleAnalysisResult } from '../types';

/**
 * Lifestyle Analysis Engine Stub
 * To be implemented by AI engineer: Analyze sleep trends, stress levels, hydration vs baseline.
 */
export function analyzeLifestylePatterns(lifestyle: LifestyleRecord[]): LifestyleAnalysisResult {
  const recent = lifestyle.slice(0, 7);
  const avgSleep = recent.length ? recent.reduce((sum, l) => sum + l.sleep, 0) / recent.length : 8;
  const highStressCount = recent.filter((l) => ['high', 'very-high'].includes(l.stress.toLowerCase())).length;
  const avgHydration = recent.length ? recent.reduce((sum, l) => sum + l.hydration, 0) / recent.length : 2.0;

  return {
    avgSleep7Days: Math.round(avgSleep * 10) / 10,
    sleepDeficit: avgSleep < 6.8,
    highStressDaysCount: highStressCount,
    isElevatedStress: highStressCount >= 3,
    avgHydration7Days: Math.round(avgHydration * 10) / 10,
    hydrationBelowTarget: avgHydration < 2.0,
  };
}
