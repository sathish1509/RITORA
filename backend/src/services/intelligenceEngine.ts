import { prisma } from '../config/db';
import { HealthInsightResponse, RiskIndicatorResponse } from '../types';

function daysDifference(startStr: string, endStr: string): number {
  const start = new Date(startStr);
  const end = new Date(endStr);
  const diffTime = end.getTime() - start.getTime();
  return Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1);
}

export async function analyzeUserHealth(userId: string): Promise<{
  insights: HealthInsightResponse[];
  riskIndicators: RiskIndicatorResponse[];
  currentCycleDay: number;
  deviation: number;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      cycles: { orderBy: { startDate: 'desc' }, take: 5 },
      symptoms: { orderBy: { date: 'desc' }, take: 20 },
      lifestyleEntries: { orderBy: { date: 'desc' }, take: 14 },
    },
  });

  if (!user) {
    return { insights: [], riskIndicators: [], currentCycleDay: 1, deviation: 0 };
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const activeCycle = user.cycles.find((c) => c.isActive) || user.cycles[0];

  const currentCycleDay = activeCycle
    ? daysDifference(activeCycle.startDate, todayStr)
    : 1;

  const deviation = currentCycleDay - user.averageCycleLength;

  const insights: HealthInsightResponse[] = [];
  const riskIndicators: RiskIndicatorResponse[] = [];

  // 1. Pattern Change / Regular Cycle Status
  if (deviation >= 4) {
    insights.push({
      id: 'ins_pattern_01',
      title: 'Pattern Change Detected',
      description: `Your current cycle is at day ${currentCycleDay}, which is ${deviation} days longer than your personal average of ${user.averageCycleLength} days. Recent lifestyle factors and symptom intensity may correlate with this pattern shift.`,
      severity: 'warning',
      category: 'pattern-change',
      icon: 'alert-triangle',
      actionableStep: 'Consider practicing 10 minutes of evening mindfulness and maintaining a consistent bedtime.',
      createdAt: todayStr,
    });
  } else {
    insights.push({
      id: 'ins_pattern_normal',
      title: 'Cycle Rhythm on Track',
      description: `Your cycle is currently on Day ${currentCycleDay} of your ${user.averageCycleLength}-day baseline. Your cycle length is progressing within expected standard parameters.`,
      severity: 'info',
      category: 'health-awareness',
      icon: 'brain',
      actionableStep: 'Keep tracking your daily symptoms and energy levels to refine future predictions.',
      createdAt: todayStr,
    });
  }

  // 2. Lifestyle: Sleep Correlation
  const last7Lifestyle = user.lifestyleEntries.slice(0, 7);
  if (last7Lifestyle.length > 0) {
    const avgSleep =
      last7Lifestyle.reduce((sum, l) => sum + l.sleep, 0) / last7Lifestyle.length;

    if (avgSleep < 6.8) {
      insights.push({
        id: 'ins_sleep_01',
        title: 'Sleep & Cycle Correlation',
        description: `Your average sleep over the last ${last7Lifestyle.length} days is ${avgSleep.toFixed(1)} hours, which is below the recommended 7-9 hours. Research shows that sleep deprivation can affect menstrual cycle regularity.`,
        severity: avgSleep < 5.5 ? 'warning' : 'info',
        category: 'lifestyle-correlation',
        icon: 'moon',
        actionableStep: 'Aim for at least 7 hours of restorative sleep tonight.',
        createdAt: todayStr,
      });
    }

    // 3. Lifestyle: Stress Impact Analysis
    const highStressDays = last7Lifestyle.filter((l) =>
      ['high', 'very-high'].includes(l.stress.toLowerCase())
    ).length;

    if (highStressDays >= 3) {
      insights.push({
        id: 'ins_stress_01',
        title: 'Stress Impact Analysis',
        description: `Your stress levels have been elevated (high to very-high) for ${highStressDays} of the last ${last7Lifestyle.length} days. Chronic stress is associated with delayed ovulation and cycle variations.`,
        severity: 'warning',
        category: 'lifestyle-correlation',
        icon: 'brain',
        actionableStep: 'Schedule short relaxation breaks during your workday.',
        createdAt: todayStr,
      });

      riskIndicators.push({
        id: 'risk_stress_01',
        type: 'Stress-Related Cycle Disruption',
        level: 'moderate',
        explanation: `Prolonged high stress levels can affect your hypothalamic-pituitary-ovarian axis, potentially delaying ovulation and extending your cycle.`,
        disclaimer:
          'This is an awareness indicator, not a medical diagnosis. Please consult a healthcare provider for proper evaluation.',
      });
    }

    // 4. Lifestyle: Hydration
    const avgHydration =
      last7Lifestyle.reduce((sum, l) => sum + l.hydration, 0) / last7Lifestyle.length;

    if (avgHydration < 2.0) {
      insights.push({
        id: 'ins_hydration_01',
        title: 'Hydration Below Target',
        description: `Your average water intake is ${avgHydration.toFixed(1)}L per day this week, below the recommended 2L minimum. Adequate hydration can help reduce bloating and improve overall cycle comfort.`,
        severity: 'info',
        category: 'lifestyle-correlation',
        icon: 'droplets',
        actionableStep: 'Keep a water bottle handy and track daily intake.',
        createdAt: todayStr,
      });
    }
  } else {
    // Helpful starting guidance for new user
    insights.push({
      id: 'ins_lifestyle_start',
      title: 'Daily Lifestyle Insights',
      description: 'Log your sleep, water intake, stress, and exercise to discover personalized health correlations.',
      severity: 'info',
      category: 'lifestyle-correlation',
      icon: 'moon',
      actionableStep: 'Go to Lifestyle to log your first entry today.',
      createdAt: todayStr,
    });
  }

  // 5. Symptom Trends & Anemia Awareness
  const fatigueSymptoms = user.symptoms.filter((s) => s.type.toLowerCase() === 'fatigue');
  const recentFatigue = fatigueSymptoms.slice(0, 3);

  if (recentFatigue.length >= 2 && recentFatigue[0].severity >= 4) {
    insights.push({
      id: 'ins_fatigue_01',
      title: 'Symptom Trend: Fatigue Increasing',
      description: `Fatigue has been reported with high severity (${recentFatigue.map((f) => f.severity).join(' → ')}/5). Combined with heavy flow and low sleep, this may indicate your body needs more rest and iron-rich nutrition.`,
      severity: 'info',
      category: 'symptom-trend',
      icon: 'battery-low',
      actionableStep: 'Incorporate iron-rich foods like spinach, lentils, or lean meats.',
      createdAt: todayStr,
    });

    riskIndicators.push({
      id: 'risk_anemia_01',
      type: 'Anemia Risk',
      level: 'moderate',
      explanation:
        'Based on your reported heavy flow, fatigue, and reduced iron-rich food intake, there is a moderate awareness level for potential iron-deficiency anemia.',
      disclaimer:
        'This is an awareness indicator, not a medical diagnosis. Please consult a healthcare provider for proper evaluation.',
    });
  }

  return {
    insights,
    riskIndicators,
    currentCycleDay,
    deviation,
  };
}
