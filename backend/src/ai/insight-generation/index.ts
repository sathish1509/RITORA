import {
  PatternResult,
  LifestyleAnalysisResult,
  EvidenceContract,
  WhatChangedResult,
  RiskScreeningItem,
  BaselineResult,
  SymptomAnalysisResult,
  HealthInsightItem,
} from '../types';
import { formatDateToISO } from '../dataPreparation';

/**
 * Returns true if meaningful lifestyle tracking data exists for this user.
 */
function hasLifestyleData(lifestyle: LifestyleAnalysisResult): boolean {
  return lifestyle.avgSleep7Days > 0 || lifestyle.avgHydration7Days > 0;
}

/**
 * Builds a rich, adaptive, empathetic primary insight that scales
 * gracefully from brand-new users (0 history) to fully-tracked users.
 */
function buildPrimaryInsight(
  pattern: PatternResult,
  lifestyle: LifestyleAnalysisResult,
  baseline: BaselineResult | undefined,
  symptomAnalysis: SymptomAnalysisResult | undefined,
  evidence: EvidenceContract[],
  todayStr: string
): HealthInsightItem {
  const baselineLength = baseline ? Math.round(baseline.meanCycleLength) : 29;
  const hasBaseline = baseline && baseline.sampleSize >= 2;
  const hasAnyLifestyle = hasLifestyleData(lifestyle);
  const cycleDay = pattern.currentCycleDay;

  // --- Determine biological phase label ---
  const periodDuration = 5;
  let phase = 'Follicular';
  if (cycleDay <= periodDuration) phase = 'Menstrual';
  else if (cycleDay <= 13) phase = 'Follicular';
  else if (cycleDay <= 16) phase = 'Ovulatory';
  else phase = 'Luteal';

  // === NEW USER / SPARSE DATA PATH ===
  if (!hasBaseline && cycleDay <= 3) {
    return {
      id: 'ins_hero_primary',
      title: 'Welcome — Your Baseline Is Being Built',
      description:
        `RITORA has recorded the start of your first tracked cycle (Day ${cycleDay}). ` +
        `As you log daily symptoms, mood, and lifestyle habits, the intelligence engine will ` +
        `learn your personal rhythm and provide increasingly precise, personalised insights.`,
      severity: 'info',
      category: 'health-awareness',
      icon: 'brain',
      actionableStep:
        'Log your period flow and any symptoms today to jump-start your personal health baseline.',
      evidence,
      createdAt: todayStr,
      isPrimary: true,
    };
  }

  // === DELAYED CYCLE ===
  if (pattern.isDelayed) {
    const coFactors: string[] = [];
    if (hasAnyLifestyle && lifestyle.sleepDeficit) {
      coFactors.push(`reduced sleep averaging ${lifestyle.avgSleep7Days.toFixed(1)}h/night`);
    }
    if (hasAnyLifestyle && lifestyle.isElevatedStress) {
      coFactors.push(`elevated stress across ${lifestyle.highStressDaysCount} recent days`);
    }
    if (symptomAnalysis && symptomAnalysis.highSeveritySymptoms.length > 0) {
      const top = symptomAnalysis.highSeveritySymptoms[0];
      coFactors.push(`increased ${top.symptomType} intensity`);
    }
    const coText = coFactors.length > 0
      ? ` Co-occurring factors in your recent logs include ${coFactors.join(', ')}.`
      : '';
    const confidenceNote = hasBaseline
      ? ` (based on your ${baseline!.sampleSize}-cycle personal average of ${baselineLength} days)`
      : '';

    return {
      id: 'ins_hero_primary',
      title: 'Cycle Delay — Pattern Change Detected',
      description:
        `Your current cycle has reached Day ${cycleDay}, which is ${pattern.deviationDays} days beyond ` +
        `your personal ${baselineLength}-day average${confidenceNote}.${coText} ` +
        `Occasional delays are common and often tied to stress, sleep, or metabolic shifts.`,
      severity: 'warning',
      category: 'pattern-change',
      icon: 'alert-triangle',
      actionableStep:
        'Try 10 minutes of evening relaxation breathing and prioritise a consistent sleep schedule over the next 3 days.',
      evidence,
      createdAt: todayStr,
      isPrimary: true,
    };
  }

  // === EARLY CYCLE ===
  if (pattern.isEarly) {
    const daysDiff = Math.abs(pattern.deviationDays);
    return {
      id: 'ins_hero_primary',
      title: 'Early Cycle Start Detected',
      description:
        `Your cycle began ${daysDiff} day${daysDiff !== 1 ? 's' : ''} earlier than your ` +
        `${baselineLength}-day personal baseline. ` +
        (hasAnyLifestyle && lifestyle.isElevatedStress
          ? `Your recent stress levels may be a contributing factor.`
          : `Occasional early starts can reflect short-term hormonal fluctuations.`),
      severity: 'info',
      category: 'pattern-change',
      icon: 'alert-triangle',
      actionableStep:
        'Monitor your flow intensity and note any unusual cramping or spotting to refine your cycle model.',
      evidence,
      createdAt: todayStr,
      isPrimary: true,
    };
  }

  // === IRREGULAR HISTORY ===
  if (pattern.status === 'IRREGULAR') {
    return {
      id: 'ins_hero_primary',
      title: 'Cycle Length Variability in History',
      description:
        `Your logged cycles show some length variability. RITORA's baseline engine continuously ` +
        `re-calibrates your personal window as you add more data — the more consistently you track, ` +
        `the more accurate your predictions become.`,
      severity: 'info',
      category: 'health-awareness',
      icon: 'brain',
      actionableStep:
        'Log period start and end dates precisely for each cycle to help RITORA tighten your prediction window.',
      evidence,
      createdAt: todayStr,
      isPrimary: true,
    };
  }

  // === HEALTHY / ON TRACK — Phase-specific ===
  const phaseDescriptions: Record<string, { summary: string; tip: string }> = {
    Menstrual: {
      summary:
        `You're currently in your Menstrual phase (Day ${cycleDay}). ` +
        `Progesterone and estrogen are at their lowest — rest and gentle nourishment are especially supportive right now.`,
      tip: 'Opt for iron-rich foods (lentils, spinach, pumpkin seeds) and scale back high-intensity workouts until flow lightens.',
    },
    Follicular: {
      summary:
        `You're in your Follicular phase (Day ${cycleDay} of your ${baselineLength}-day cycle). ` +
        `Rising estrogen typically brings an energy boost, sharper focus, and improved mood.`,
      tip: 'Leverage the natural energy lift: front-load demanding tasks and try lighter, nutrient-dense foods to complement rising metabolism.',
    },
    Ovulatory: {
      summary:
        `You're approaching or in your Ovulatory window (Day ${cycleDay}). ` +
        `Estrogen peaks drive peak energy, communication strength, and heightened social confidence.`,
      tip: 'Note any mid-cycle discomfort (Mittelschmerz) and track basal body temperature to confirm ovulation timing.',
    },
    Luteal: {
      summary:
        `You're in your Luteal phase (Day ${cycleDay} of your ${baselineLength}-day cycle). ` +
        `Progesterone rises, which can bring fatigue, food cravings, or mood sensitivity in the latter half. ` +
        (hasAnyLifestyle
          ? `Your current sleep average of ${lifestyle.avgSleep7Days.toFixed(1)}h${lifestyle.sleepDeficit ? ' is below optimal' : ' is within a healthy range'} for this phase.`
          : `Consistent sleep is especially valuable during this phase.`),
      tip: 'Prioritise magnesium-rich foods (dark chocolate, avocado, nuts) and aim for 7–9h sleep to ease premenstrual symptoms.',
    },
  };

  const phaseInfo = phaseDescriptions[phase] || phaseDescriptions['Follicular'];
  const baselineNote = hasBaseline
    ? ` Your ${baseline!.sampleSize}-cycle personal baseline confirms a ${baselineLength}-day average — rhythm is progressing normally.`
    : '';

  return {
    id: 'ins_hero_primary',
    title: `${phase} Phase — Cycle on Track`,
    description: phaseInfo.summary + baselineNote,
    severity: 'info',
    category: 'health-awareness',
    icon: 'brain',
    actionableStep: phaseInfo.tip,
    evidence,
    createdAt: todayStr,
    isPrimary: true,
  };
}

/**
 * Health Insight Generator
 * Synthesizes multi-engine outputs (baseline, what-changed, symptoms, lifestyle, and risks)
 * into an empathetic, coherent, explainable set of dashboard insights.
 * Scales gracefully from sparse new-user data to fully-tracked profiles.
 */
export function generateHealthInsights(
  pattern: PatternResult,
  lifestyle: LifestyleAnalysisResult,
  evidence: EvidenceContract[],
  whatChanged?: WhatChangedResult,
  riskScreening?: RiskScreeningItem[],
  baseline?: BaselineResult,
  symptomAnalysis?: SymptomAnalysisResult
): HealthInsightItem[] {
  const insights: HealthInsightItem[] = [];
  const todayStr = formatDateToISO(new Date());
  const hasAnyLifestyle = hasLifestyleData(lifestyle);

  // -------------------------------------------------------------
  // 1. Primary Hero Insight (adaptive, phase-aware)
  // -------------------------------------------------------------
  insights.push(buildPrimaryInsight(pattern, lifestyle, baseline, symptomAnalysis, evidence, todayStr));

  // -------------------------------------------------------------
  // 2. Lifestyle Correlation Insights (only when real data exists)
  // -------------------------------------------------------------
  if (hasAnyLifestyle) {
    if (lifestyle.sleepDeficit && lifestyle.isElevatedStress) {
      insights.push({
        id: 'ins_lifestyle_sleep_stress',
        title: 'Sleep Deficit & Elevated Stress',
        description:
          `Your 7-day average sleep of ${lifestyle.avgSleep7Days.toFixed(1)}h coincides with ` +
          `${lifestyle.highStressDaysCount} high-stress day${lifestyle.highStressDaysCount !== 1 ? 's' : ''}. ` +
          `This combination can disrupt cortisol rhythms, which in turn affects the hypothalamic–pituitary–ovarian axis — ` +
          `a key regulator of cycle regularity.`,
        severity: lifestyle.avgSleep7Days < 5.5 ? 'warning' : 'info',
        category: 'lifestyle-correlation',
        icon: 'moon',
        actionableStep:
          'Create a screen-free 30-minute wind-down before bed. Even one extra hour of sleep this week can meaningfully lower cortisol.',
        createdAt: todayStr,
      });
    } else if (lifestyle.sleepDeficit) {
      insights.push({
        id: 'ins_lifestyle_sleep',
        title: 'Sleep Deficit Identified',
        description:
          `Your rolling 7-day sleep average of ${lifestyle.avgSleep7Days.toFixed(1)}h falls below the ` +
          `7–9h recommended for optimal hormonal recovery. ` +
          `Consistent short sleep is linked to elevated cortisol and can affect cycle regularity over time.`,
        severity: 'info',
        category: 'lifestyle-correlation',
        icon: 'moon',
        actionableStep:
          'Aim for a consistent bedtime tonight — even a 30-minute earlier start helps your circadian rhythm realign.',
        createdAt: todayStr,
      });
    } else if (lifestyle.isElevatedStress && !lifestyle.sleepDeficit) {
      insights.push({
        id: 'ins_lifestyle_stress',
        title: 'Stress Elevation Noted',
        description:
          `${lifestyle.highStressDaysCount} of your recent 7 days show elevated stress. ` +
          `Chronic stress raises cortisol, which can suppress LH surges and subtly shift ovulation timing. ` +
          `Your sleep appears adequate — maintaining this will help buffer the stress response.`,
        severity: 'info',
        category: 'lifestyle-correlation',
        icon: 'activity',
        actionableStep:
          'Incorporate 5 minutes of box-breathing (4-4-4-4 pattern) after lunch — clinical evidence supports this for acute cortisol reduction.',
        createdAt: todayStr,
      });
    }

    // Hydration sub-insight
    if (lifestyle.hydrationBelowTarget) {
      insights.push({
        id: 'ins_lifestyle_hydration',
        title: 'Hydration Below Daily Target',
        description:
          `Your average water intake of ${lifestyle.avgHydration7Days.toFixed(1)} L/day is below the ` +
          `recommended 2.0 L target. Proper hydration supports metabolic balance, eases bloating, ` +
          `and helps maintain endometrial health.`,
        severity: 'info',
        category: 'lifestyle-correlation',
        icon: 'droplets',
        actionableStep:
          'Keep a 500 mL bottle on your desk and refill it 4× today. A glass of water upon waking and before each meal is an easy anchor habit.',
        createdAt: todayStr,
      });
    }
  } else {
    // No lifestyle data yet → warm onboarding nudge
    insights.push({
      id: 'ins_lifestyle_nudge',
      title: 'Start Your Lifestyle Tracking',
      description:
        `RITORA's lifestyle intelligence module analyses sleep, stress, hydration, and exercise patterns ` +
        `to surface correlations with your cycle rhythm. You haven't logged any lifestyle data yet — ` +
        `your first entry will unlock personalised lifestyle-cycle correlation insights.`,
      severity: 'info',
      category: 'lifestyle-correlation',
      icon: 'moon',
      actionableStep:
        "Head to the Lifestyle page and log today's sleep and stress level — it only takes 30 seconds.",
      createdAt: todayStr,
    });
  }

  // -------------------------------------------------------------
  // 3. Symptom Trend Insight
  // -------------------------------------------------------------
  if (symptomAnalysis && symptomAnalysis.topSymptoms.length > 0) {
    const prominentSymptom = symptomAnalysis.topSymptoms[0];
    if (prominentSymptom.pattern === 'recurring' || prominentSymptom.averageSeverity >= 3.5 || prominentSymptom.isIncreasing) {
      const symName = prominentSymptom.symptomType.charAt(0).toUpperCase() + prominentSymptom.symptomType.slice(1);
      const severityLabel = prominentSymptom.averageSeverity >= 4.5 ? 'severe' : prominentSymptom.averageSeverity >= 3.5 ? 'moderate-to-high' : 'moderate';
      insights.push({
        id: `ins_symptom_${prominentSymptom.symptomType}`,
        title: `Recurring Symptom Trend: ${symName}`,
        description:
          prominentSymptom.trendDescription ||
          `${symName} has appeared as a ${severityLabel}-severity symptom (avg ${prominentSymptom.averageSeverity.toFixed(1)}/5) across ` +
          `${prominentSymptom.occurrences || 'several'} recent log${(prominentSymptom.occurrences || 2) !== 1 ? 's' : ''}.` +
          (prominentSymptom.isIncreasing ? ' The trend is increasing — worth monitoring closely.' : ''),
        severity: prominentSymptom.averageSeverity >= 4.0 ? 'warning' : 'info',
        category: 'symptom-trend',
        icon: prominentSymptom.symptomType.includes('fatigue') ? 'battery-low' : 'alert-triangle',
        actionableStep: prominentSymptom.symptomType.includes('fatigue')
          ? 'Increase iron-rich foods (spinach, lentils, pumpkin seeds) and consider a brief midday rest to support recovery.'
          : 'Warm compresses, magnesium-rich snacks (dark chocolate, bananas), and gentle stretching can ease cramp-type discomfort.',
        createdAt: todayStr,
      });
    }
  }

  // -------------------------------------------------------------
  // 4. What Changed Insight (regression-detected metric shifts)
  // -------------------------------------------------------------
  if (whatChanged && whatChanged.changes && whatChanged.changes.length > 0) {
    const topChange = whatChanged.changes[0];
    if (topChange && topChange.metricName) {
      insights.push({
        id: 'ins_what_changed',
        title: `Metric Shift Detected: ${topChange.metricName}`,
        description:
          topChange.description ||
          `RITORA's pattern engine detected a statistically notable change in your ${topChange.metricName} over recent cycles.`,
        severity: 'info',
        category: 'pattern-change',
        icon: 'trending-up',
        actionableStep:
          'Continue logging consistently — this helps RITORA distinguish genuine shifts from normal variation.',
        createdAt: todayStr,
      });
    }
  }

  // -------------------------------------------------------------
  // 5. Clinical Risk Awareness Insight
  // -------------------------------------------------------------
  if (riskScreening && riskScreening.length > 0) {
    const primaryRisk = riskScreening[0];
    insights.push({
      id: `ins_${primaryRisk.id}`,
      title: `Health Awareness: ${primaryRisk.type}`,
      description: primaryRisk.explanation,
      severity: primaryRisk.level === 'high' ? 'alert' : 'warning',
      category: 'health-awareness',
      icon: 'alert-triangle',
      actionableStep: primaryRisk.suggestedAction,
      createdAt: todayStr,
    });
  }

  return insights;
}

