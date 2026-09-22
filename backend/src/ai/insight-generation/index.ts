import { HealthInsightItem, PatternResult, LifestyleAnalysisResult, EvidenceContract } from '../types';

/**
 * Insight Generation Engine Stub
 * To be implemented by AI engineer: Synthesizes modular analysis into user-facing explainable health insights.
 */
export function generateHealthInsights(
  pattern: PatternResult,
  lifestyle: LifestyleAnalysisResult,
  evidence: EvidenceContract[]
): HealthInsightItem[] {
  const insights: HealthInsightItem[] = [];
  const todayStr = new Date().toISOString().split('T')[0];

  if (pattern.isDelayed) {
    insights.push({
      id: 'ins_pattern_delayed',
      title: 'Pattern Change Detected',
      description: pattern.summary,
      severity: 'warning',
      category: 'pattern-change',
      icon: 'alert-triangle',
      actionableStep: 'Consider practicing evening relaxation and logging sleep hours.',
      evidence,
      createdAt: todayStr,
    });
  } else {
    insights.push({
      id: 'ins_pattern_normal',
      title: 'Cycle Rhythm on Track',
      description: pattern.summary,
      severity: 'info',
      category: 'health-awareness',
      icon: 'brain',
      actionableStep: 'Keep tracking daily symptoms and energy levels.',
      evidence,
      createdAt: todayStr,
    });
  }

  if (lifestyle.sleepDeficit) {
    insights.push({
      id: 'ins_sleep_deficit',
      title: 'Sleep & Cycle Correlation',
      description: `Your average sleep of ${lifestyle.avgSleep7Days}h is below the 7-9h target.`,
      severity: 'info',
      category: 'lifestyle-correlation',
      icon: 'moon',
      actionableStep: 'Aim for at least 7 hours of restorative sleep tonight.',
      createdAt: todayStr,
    });
  }

  return insights;
}
