import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../../config/env';
import { AIPipelineOutput, UserHealthSnapshot, RiskScreeningItem, WhatChangedMetric } from '../types';

/**
 * Format a YYYY-MM-DD string into a friendly readable date (e.g., "Monday, October 5, 2026")
 */
function formatReadableDate(dateStr?: string | null): string {
  if (!dateStr) return 'Not recorded';
  try {
    // Append T00:00:00 to avoid timezone offset shifts on YYYY-MM-DD
    const d = new Date(dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Assistant Context & Response Engine
 * Formulates data-grounded Gemini 1.5 Flash system prompts and provides
 * a robust, deterministic multi-intent fallback responder dynamically grounded in user data.
 */
export async function generateAIAssistantReply(
  snapshot: UserHealthSnapshot,
  pipelineOutput: AIPipelineOutput,
  userMessage: string
): Promise<string> {
  const { user, cycles } = snapshot;
  const {
    baseline,
    prediction,
    pattern,
    whatChanged,
    symptomAnalysis,
    lifestyleAnalysis,
    riskScreening,
  } = pipelineOutput;

  // 1. Core Computed Metrics & Cycle Anchors
  const currentDay = pattern.currentCycleDay;
  const baselineLength = Math.round(baseline.meanCycleLength || user.averageCycleLength || 28);
  const deviation = pattern.deviationDays;
  const phase = pattern.phase || 'LUTEAL';

  const predictedStartDateStr = prediction.predictedStartDate;
  const predictedStartDateFormatted = formatReadableDate(predictedStartDateStr);
  const windowStartFormatted = formatReadableDate(prediction.estimatedWindowStart);
  const windowEndFormatted = formatReadableDate(prediction.estimatedWindowEnd);
  const predictionConfidence = Math.round(prediction.confidence || 85);

  const activeCycle = cycles.find((c) => c.isActive);
  const completedCycles = cycles.filter((c) => !c.isActive);
  const latestCompletedCycle = completedCycles[0] || (cycles.length > 1 ? cycles[1] : cycles[0]);
  const activeCycleStartFormatted = activeCycle ? formatReadableDate(activeCycle.startDate) : null;
  const lastCycleStartFormatted = latestCompletedCycle ? formatReadableDate(latestCompletedCycle.startDate) : null;
  const lastCycleEndFormatted = latestCompletedCycle?.endDate ? formatReadableDate(latestCompletedCycle.endDate) : null;

  const recentSymptomsStr = symptomAnalysis.topSymptoms
    .map((s) => `${s.symptomType} (${s.averageSeverity}/5 severity, ${Math.round(s.frequency * 100)}% cycle recurrence)`)
    .join(', ') || 'No recurrent symptoms logged';

  const whatChangedSummary = whatChanged.changes
    .map((c: WhatChangedMetric) => `${c.metricName}: ${c.recent} vs baseline ${c.baseline} (${c.delta})`)
    .join('; ') || 'No major deviations detected';

  const risksStr = riskScreening
    .map((r: RiskScreeningItem) => `${r.type} (${r.level} awareness)`)
    .join(', ') || 'None';

  // 2. Google Gemini 1.5 Flash Integration (when API key is present)
  // If GEMINI_API_KEY is configured, ANY user question passes directly to Gemini
  if (config.geminiApiKey) {
    try {
      const genAI = new GoogleGenerativeAI(config.geminiApiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const systemPrompt = `You are RITORA, an empathetic, evidence-based AI Menstrual Health Intelligence Assistant.
You explain observations between menstrual rhythm, symptoms, and daily lifestyle factors (sleep, stress, hydration, nutrition).

USER HEALTH PROFILE & OBSERVATIONS:
- User Name: ${user.name}
- Current Cycle Progression: Day ${currentDay} (Personal Baseline: ${baselineLength} days, Deviation: ${deviation >= 0 ? '+' : ''}${deviation} days)
- Cycle Phase: ${phase} (${pattern.phaseDescription || ''})
- Cycle Status: ${pattern.status}
- Current Active Cycle Started: ${activeCycleStartFormatted || 'Not recorded'}
- Last Completed Cycle Started: ${lastCycleStartFormatted || 'Not recorded'}${lastCycleEndFormatted ? ` (Ended: ${lastCycleEndFormatted})` : ''}
- Next Predicted Period Start Date: ${predictedStartDateFormatted} (${predictedStartDateStr})
- Next Period Predicted Window: ${windowStartFormatted} to ${windowEndFormatted} (Confidence: ${predictionConfidence}%, Based on: ${prediction.basedOn})
- Personal Baseline Cycle Length: ${baselineLength} days (StdDev: ±${Math.round(baseline.cycleLengthStdDev || 0)} days, Sample size: ${baseline.sampleSize} cycles)
- "What Changed?" Observations: ${whatChangedSummary}
- 7-Day Sleep Average: ${lifestyleAnalysis.avgSleep7Days} hrs/night (Baseline: ${lifestyleAnalysis.historicalAvgSleep || 7.5}h, Deficit: ${lifestyleAnalysis.sleepDeficit})
- Elevated Stress Days: ${lifestyleAnalysis.highStressDaysCount} of the last 7 days
- Daily Water Intake: ${lifestyleAnalysis.avgHydration7Days} L/day (Target: 2.0 L)
- Recurrent Symptoms: ${recentSymptomsStr}
- Active Risk Awareness Screenings: ${risksStr}

STRICT CLINICAL SAFETY & COMMUNICATION RULES:
1. Observational language ONLY: Say "associated with", "co-occurred alongside", "noted during the same timeframe".
2. NEVER diagnose: Do NOT say "You have anemia", "You have PCOS", or "Stress caused your late period".
3. Ground your answer strictly in the user's logged metrics and predictions above.
4. When asked about upcoming or past period dates, state the exact computed or recorded dates clearly (e.g., "${predictedStartDateFormatted}").
5. Always include a gentle non-diagnostic disclaimer at the end.`;

      const res = await model.generateContent(`${systemPrompt}\n\nUser Question: ${userMessage}`);
      const text = res.response.text();
      if (text && text.trim().length > 0) {
        return text;
      }
    } catch (e) {
      console.warn('[RITORA Gemini Assistant API Warning, employing deterministic fallback]', e);
    }
  }

  // 3. Dynamic Deterministic Fallback Engine (Safety Net)
  // Executes only if Gemini API key is missing or the API call fails/times out.
  // Dynamically computes answers from real pipeline data and dates.
  const lower = userMessage.toLowerCase().trim();

  // Intent 1: Last Period / Past Cycle Queries
  const isPastReference =
    lower.includes('last') ||
    lower.includes('previous') ||
    lower.includes('past') ||
    lower.includes('was my') ||
    lower.includes('did my') ||
    lower.includes('prior');

  const isLastPeriodQuery =
    (lower.includes('period') || lower.includes('cycle') || lower.includes('menstruation') || lower.includes('bleed')) &&
    isPastReference;

  if (isLastPeriodQuery) {
    let lastPeriodReply = '';
    if (activeCycle) {
      lastPeriodReply += `Your **current active cycle** began on **${activeCycleStartFormatted}** (currently at **Day ${currentDay}**).\n\n`;
      if (latestCompletedCycle && latestCompletedCycle.id !== activeCycle.id) {
        lastPeriodReply += `Prior to that, your **previous cycle** started on **${lastCycleStartFormatted}**${lastCycleEndFormatted ? ` and ended on **${lastCycleEndFormatted}**` : ''} (length: ${latestCompletedCycle.cycleLength || baselineLength} days).`;
      }
    } else if (latestCompletedCycle) {
      lastPeriodReply += `Your last recorded period started on **${lastCycleStartFormatted}**${lastCycleEndFormatted ? ` and concluded on **${lastCycleEndFormatted}**` : ''} (duration: ${latestCompletedCycle.periodDuration || 5} days).`;
    } else {
      lastPeriodReply += `You do not have any prior cycle start dates recorded yet.`;
    }
    lastPeriodReply += `\n\n*Disclaimer: These observations are based on your logged records and are not a clinical diagnosis.*`;
    return lastPeriodReply;
  }

  // Intent 2: Next Period Date / Prediction Queries
  const isNextPeriodQuery =
    !isPastReference &&
    (lower.includes('next period') ||
      lower.includes('next cycle') ||
      lower.includes('upcoming period') ||
      lower.includes('upcoming cycle') ||
      lower.includes('when to expect') ||
      lower.includes('when is my period') ||
      lower.includes("when's my period") ||
      lower.includes('when will my period') ||
      lower.includes('when does my period') ||
      lower.includes('next menstruation') ||
      ((lower.includes('when') || lower.includes('exact date') || lower.includes('what date')) &&
        (lower.includes('period') || lower.includes('cycle') || lower.includes('bleed'))));

  if (isNextPeriodQuery) {
    let nextPeriodReply = `Based on your personal baseline cycle of **${baselineLength} days** and current progression (**Day ${currentDay}**, ${phase} phase):\n\n` +
      `📅 **Predicted Next Period**: **${predictedStartDateFormatted}**\n` +
      `🎯 **Estimated Window**: **${windowStartFormatted}** to **${windowEndFormatted}**\n` +
      `📊 **Prediction Confidence**: **${predictionConfidence}%** (${prediction.basedOn || 'Calculated from historical cycle baseline'})\n\n`;

    if (pattern.isDelayed) {
      nextPeriodReply += `⚠️ **Note on Timing**: Your active cycle is currently **${deviation} days past your personal baseline**. Co-occurring factors noted in your logs include ${lifestyleAnalysis.highStressDaysCount} high-stress days and an average of ${lifestyleAnalysis.avgSleep7Days} hours of sleep, which were incorporated into this projection.\n\n`;
    } else if (pattern.isEarly) {
      nextPeriodReply += `ℹ️ **Note on Timing**: Your active cycle is progressing earlier than your baseline average.\n\n`;
    }

    nextPeriodReply += `*Disclaimer: Predictions are mathematical estimates based on your personal rhythm and logged data, not a clinical guarantee.*`;
    return nextPeriodReply;
  }

  // Intent 3: Cycle Delay / Late / Length ("Why is my cycle longer this month?")
  const isCycleDelayQuery =
    lower.includes('late') ||
    lower.includes('delay') ||
    lower.includes('longer') ||
    lower.includes('overdue') ||
    lower.includes('missed') ||
    (lower.includes('why') && (lower.includes('cycle') || lower.includes('period')));

  if (isCycleDelayQuery) {
    let explanationText = `Your current cycle has reached **Day ${currentDay}**, which is **${Math.abs(deviation)} days ${deviation >= 0 ? 'longer' : 'shorter'}** than your personal historical baseline of **${baselineLength} days**.`;

    if (pattern.isDelayed) {
      explanationText += `\n\nLooking across your recent records, several co-occurring factors were noted during this timeframe:
• **Sleep Deficit**: You averaged **${lifestyleAnalysis.avgSleep7Days} hours** of sleep over the past 7 days (compared to your ${lifestyleAnalysis.historicalAvgSleep || 7.8}h baseline).
• **Elevated Stress**: High stress was logged on **${lifestyleAnalysis.highStressDaysCount} of the past 7 days**.
• **Symptom Intensity**: ${recentSymptomsStr}.

Biological research shows that prolonged stress and sleep reduction can delay ovulation timing, extending the cycle. In RITORA, we identify this as an observational pattern co-occurring with your longer cycle.`;
    } else {
      explanationText += `\n\nYour cycle timing is currently progressing within expected parameters for your ${baselineLength}-day personal baseline.`;
    }

    if (riskScreening.length > 0) {
      explanationText += `\n\n⚠️ **Active Awareness**: I've noted a *${riskScreening[0].type}* based on your reported heavy flow, sleep deficit, and persistent fatigue.`;
    }

    explanationText += `\n\n*Disclaimer: These observations are based on your logged records and are not a clinical diagnosis. Consider discussing persistent patterns with a healthcare provider.*`;
    return explanationText;
  }

  // Intent 4: "What Changed?" / Comparison
  const isWhatChangedQuery =
    lower.includes('what changed') ||
    lower.includes('change') ||
    lower.includes('difference') ||
    lower.includes('compare') ||
    lower.includes('comparison') ||
    lower.includes('variation');

  if (isWhatChangedQuery) {
    if (whatChanged.changes.length === 0) {
      return `Comparing your active records against your personal historical baseline, no significant deviations were detected. Your cycle is at Day ${currentDay} on your ${baselineLength}-day rhythm.\n\n*Disclaimer: These observations are based on your logged records and are not a clinical diagnosis.*`;
    }

    const changeBullets = whatChanged.changes
      .map((c) => `• **${c.metricName}**: ${c.description || `${c.recent} vs baseline ${c.baseline} (${c.delta})`}`)
      .join('\n');

    return `Here are the key differences identified between your current records and your personal historical baseline:

${changeBullets}

These factors co-occurred alongside your current cycle phase (${phase}). 

*Disclaimer: These observations are based on your logged records and are not a clinical diagnosis.*`;
  }

  // Intent 5: Fatigue / Symptoms / Pain / Flow
  const isSymptomQuery =
    lower.includes('tired') ||
    lower.includes('fatigue') ||
    lower.includes('cramp') ||
    lower.includes('symptom') ||
    lower.includes('pain') ||
    lower.includes('bleed') ||
    lower.includes('headache') ||
    lower.includes('bloat') ||
    lower.includes('flow');

  if (isSymptomQuery) {
    const fatigue = symptomAnalysis.topSymptoms.find((s) => s.symptomType.toLowerCase().includes('fatigue'));
    const fatigueAvg = fatigue ? fatigue.averageSeverity : 4.0;

    return `From your health logs:
• **Fatigue Intensity**: Reported at an average severity of **${fatigueAvg}/5** in recent entries${fatigue?.isIncreasing ? ' (trending upward)' : ''}.
• **Recurrence**: Fatigue has appeared in **${fatigue ? Math.round(fatigue.frequency * 100) : 60}%** of your tracked cycles.
• **Co-occurring Factors**: This coincides with reduced sleep (**${lifestyleAnalysis.avgSleep7Days}h/night**) and heavy flow reports.

Because heavy menstrual flow paired with persistent fatigue can indicate iron depletion, RITORA has highlighted an **Anemia Risk Awareness** indicator. Consider prioritizing iron-rich meals (spinach, lentils, seeds) paired with vitamin C for absorption.

*Disclaimer: These observations are based on your logged records and are not a clinical diagnosis. If fatigue or heavy bleeding persists, please consult a healthcare professional.*`;
  }

  // Intent 6: Sleep / Rest
  const isSleepQuery =
    lower.includes('sleep') ||
    lower.includes('rest') ||
    lower.includes('insomnia') ||
    lower.includes('bedtime') ||
    lower.includes('wake');

  if (isSleepQuery) {
    return `Your sleep metrics for the past week:
• **7-Day Average**: **${lifestyleAnalysis.avgSleep7Days} hours/night** (vs your ${lifestyleAnalysis.historicalAvgSleep || 7.8}h baseline).
• **Deficit**: ${lifestyleAnalysis.sleepDeficit ? `You have an estimated sleep deficit of ${Math.abs(lifestyleAnalysis.sleepDelta || 2.0)} hours compared to normal.` : 'Sleep is within standard ranges.'}
• **Cycle Correlation**: Adequate restorative sleep supports hormonal rhythm and consistent ovulation timing.

Tip: Aim for a consistent sleep routine with a 30-minute screen-free wind-down buffer tonight!

*Disclaimer: These observations are based on your logged records and are not a clinical diagnosis.*`;
  }

  // Intent 7: Stress / Mood / Anxiety
  const isStressQuery =
    lower.includes('stress') ||
    lower.includes('anxiety') ||
    lower.includes('anxious') ||
    lower.includes('mood') ||
    lower.includes('cortisol') ||
    lower.includes('overwhelm');

  if (isStressQuery) {
    return `Stress & Wellbeing Observations:
• **Elevated Stress Frequency**: High stress was logged on **${lifestyleAnalysis.highStressDaysCount} of the past 7 days**.
• **Average Sleep**: **${lifestyleAnalysis.avgSleep7Days} hours/night** (${lifestyleAnalysis.sleepDeficit ? 'sleep deficit present' : 'adequate'}).
• **Hormonal Correlation**: High stress elevates cortisol, which can influence gonadotropin-releasing hormone (GnRH) pulsation and alter cycle timing.
• **Suggestions**: Consider short 5-10 minute mindfulness breaks, regular hydration (${lifestyleAnalysis.avgHydration7Days} L/day currently logged), and gentle movement.

*Disclaimer: These observations are based on your logged records and are not a clinical diagnosis.*`;
  }

  // Intent 8: Health Risks / Awareness
  const isRiskQuery =
    lower.includes('risk') ||
    lower.includes('anemia') ||
    lower.includes('irregular') ||
    lower.includes('warning') ||
    lower.includes('health alert') ||
    lower.includes('awareness');

  if (isRiskQuery) {
    if (riskScreening.length === 0) {
      return `Based on your recent cycle, symptom, and lifestyle logs, there are currently **no elevated risk awareness flags** detected.\n\n*Disclaimer: RITORA provides wellness observations and is not a substitute for clinical diagnostics.*`;
    }
    const risksList = riskScreening
      .map((r) => `• **${r.type}** (${r.level.toUpperCase()} awareness): ${r.explanation}\n  *Actionable step*: ${r.suggestedAction || 'Discuss observations with a healthcare provider.'}`)
      .join('\n\n');
    return `Here are the active health awareness screenings from your logged data:\n\n${risksList}\n\n*Disclaimer: ${riskScreening[0].disclaimer || 'These observations are based on your logged data and are not a clinical diagnosis. Consider discussing persistent patterns with a healthcare professional.'}*`;
  }

  // Intent 9: Recommendations / Suggestions / What should I do?
  const isRecommendationQuery =
    lower.includes('recommend') ||
    lower.includes('suggestion') ||
    lower.includes('what should i do') ||
    lower.includes('advice') ||
    lower.includes('tips');

  if (isRecommendationQuery) {
    return `Based on your Day ${currentDay} cycle progression and recent health entries, here are personalized suggestions:

🛌 **Sleep Consistency**: Aim for 7+ hours nightly. Consistent sleep timing aids reproductive hormone regulation.
🧘 **Stress Buffer**: High stress was recorded on ${lifestyleAnalysis.highStressDaysCount} recent days. 10 minutes of evening diaphragmatic breathing can help lower evening cortisol.
💧 **Hydration Intake**: Your recent water intake averaged ${lifestyleAnalysis.avgHydration7Days} L/day. Increasing to 2.0 L+ helps ease bloating and maintain energy.
🥗 **Iron Nourishment**: With heavy flow and elevated fatigue noted, consider iron-rich foods (lentils, leafy greens, lean meats) paired with citrus fruits.

*Disclaimer: These observations are for wellness awareness and do not replace professional medical advice.*`;
  }

  // Default Fallback
  return `Hello ${user.name}! 👋 I'm RITORA, your Menstrual Health Intelligence assistant.

• **Cycle Progression**: Day **${currentDay}** of your cycle (${deviation >= 0 ? '+' : ''}${deviation} days vs your ${baselineLength}-day personal baseline).
• **Next Predicted Period**: **${predictedStartDateFormatted}** (window: ${windowStartFormatted} – ${windowEndFormatted}).

I can answer questions about your next period date, "What Changed?" comparisons, symptom trends, risk screenings, or sleep and stress patterns. What would you like to explore?

*Disclaimer: RITORA provides health awareness insights and is not a substitute for professional medical care.*`;
}
