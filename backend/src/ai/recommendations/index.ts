import { RecommendationItem, LifestyleAnalysisResult, PatternResult } from '../types';

/**
 * Recommendations Engine
 * Generates evidence-based, actionable lifestyle and cycle guidance
 * based on real-time AI pipeline output (sleep deficit, stress, hydration analysis).
 */
export function generateRecommendations(
  lifestyle: LifestyleAnalysisResult,
  pattern: PatternResult
): RecommendationItem[] {
  const recs: RecommendationItem[] = [];

  if (lifestyle.sleepDeficit) {
    recs.push({
      id: 'rec_sleep_01',
      category: 'SLEEP',
      title: 'Prioritize Consistent Sleep',
      suggestion: 'A consistent sleep schedule supports hormone regulation.',
      priority: 'HIGH',
    });
  }

  if (lifestyle.isElevatedStress) {
    recs.push({
      id: 'rec_stress_01',
      category: 'STRESS',
      title: 'Stress Relief Practice',
      suggestion: 'Incorporate 10 minutes of deep diaphragmatic breathing.',
      priority: 'HIGH',
    });
  }

  if (lifestyle.hydrationBelowTarget) {
    recs.push({
      id: 'rec_hydration_01',
      category: 'HYDRATION',
      title: 'Increase Hydration',
      suggestion: 'Aim for 2.0L+ daily to reduce cycle bloating.',
      priority: 'MEDIUM',
    });
  }

  return recs;
}
