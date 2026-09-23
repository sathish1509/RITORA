import {
  UserHealthSnapshot,
  BaselineResult,
  SymptomAnalysisResult,
  LifestyleAnalysisResult,
  PatternResult,
  RiskScreeningItem,
  CycleRecord,
} from '../types';
import { calculateDaysDifference, formatDateToISO } from '../dataPreparation';

const CLINICAL_DISCLAIMER =
  'These observations are based on your logged data and are not a clinical diagnosis. Consider discussing persistent patterns with a healthcare professional.';

/**
 * Helper to check if a cycle record exhibits heavy menstrual flow
 */
function hasHeavyFlow(cycle: CycleRecord | undefined): boolean {
  if (!cycle || !cycle.flow) return false;
  const f = typeof cycle.flow === 'string' ? cycle.flow.toLowerCase() : JSON.stringify(cycle.flow).toLowerCase();
  return f.includes('heavy');
}

/**
 * Risk-Awareness Screening Engine
 * Non-diagnostic clinical pattern screening adhering to strict medical safety principles.
 * Identifies multi-factorial patterns (anemia risk awareness, cycle irregularity, and extended delays).
 */
export function screenHealthRisks(
  snapshot: UserHealthSnapshot,
  baseline?: BaselineResult,
  symptomAnalysis?: SymptomAnalysisResult,
  lifestyleAnalysis?: LifestyleAnalysisResult,
  pattern?: PatternResult
): RiskScreeningItem[] {
  const risks: RiskScreeningItem[] = [];
  const todayStr = formatDateToISO(new Date());

  // 1. Resolve Active Cycle Progression & Baseline
  const activeCycle = snapshot.cycles.find((c) => c.isActive) || snapshot.cycles[0];
  const baselineLength = baseline
    ? Math.round(baseline.meanCycleLength)
    : snapshot.user.averageCycleLength || 28;

  let currentCycleDay = 1;
  if (activeCycle && activeCycle.startDate) {
    currentCycleDay = calculateDaysDifference(activeCycle.startDate, todayStr);
  }
  const deviationDays = pattern ? pattern.deviationDays : currentCycleDay - baselineLength;

  // -------------------------------------------------------------
  // Screening 1: Multi-Factor Anemia-Risk Awareness
  // Criteria: Heavy menstrual flow + recurring/high fatigue (>= 4/5) + sleep deficit co-occurring
  // -------------------------------------------------------------
  const recentCycles = snapshot.cycles.slice(0, 3);
  const exhibitsHeavyFlow = recentCycles.some((c) => hasHeavyFlow(c));

  const fatigueSymptoms = snapshot.symptoms.filter((s) => s.type.toLowerCase().includes('fatigue'));
  const hasHighFatigue = fatigueSymptoms.some((s) => s.severity >= 4);
  const avgFatigue = fatigueSymptoms.length > 0
    ? fatigueSymptoms.reduce((sum, s) => sum + s.severity, 0) / fatigueSymptoms.length
    : 0;

  // Check recurring fatigue in symptom analysis if available, or >= 2 fatigue reports
  const isFatigueRecurring = symptomAnalysis
    ? symptomAnalysis.topSymptoms.some((s) => s.symptomType === 'fatigue' && (s.frequency >= 0.4 || s.isIncreasing))
    : fatigueSymptoms.length >= 2;

  // Check sleep deficit
  const recent7Lifestyle = snapshot.lifestyle.slice(0, 7);
  const avgSleep = recent7Lifestyle.length > 0
    ? recent7Lifestyle.reduce((sum, l) => sum + (l.sleep || 7.5), 0) / recent7Lifestyle.length
    : 7.5;
  const hasSleepDeficit = lifestyleAnalysis ? lifestyleAnalysis.sleepDeficit : avgSleep < 6.8;

  if (exhibitsHeavyFlow && (hasHighFatigue || avgFatigue >= 3.5 || isFatigueRecurring) && hasSleepDeficit) {
    risks.push({
      id: 'risk_anemia_awareness',
      type: 'Anemia Risk Awareness',
      level: hasHighFatigue && avgSleep < 5.8 ? 'high' : 'moderate',
      explanation:
        'Reported heavy menstrual flow, high-intensity fatigue (severity ≥ 4/5), and a persistent sleep deficit co-occur in your recent health records. These combined factors warrant iron-level awareness.',
      contributingFactors: [
        'Heavy menstrual flow recorded in recent cycle history',
        `High-severity fatigue logged (${fatigueSymptoms.slice(0, 2).map((f) => `${f.severity}/5`).join(', ')})`,
        `Recent 7-day sleep average of ${avgSleep.toFixed(1)} hrs/night`,
      ],
      suggestedAction:
        'Consider incorporating iron-rich foods (spinach, lentils, seeds, lean protein) paired with vitamin C, and discuss persistent fatigue with your healthcare provider.',
      disclaimer: CLINICAL_DISCLAIMER,
    });
  }

  // -------------------------------------------------------------
  // Screening 2: Irregular-Cycle Awareness
  // Criteria: Cycle length standard deviation sigma > 5 days across >= 3 completed cycles
  // -------------------------------------------------------------
  const completedCycles = snapshot.cycles.filter((c) => !c.isActive && c.cycleLength && c.cycleLength > 0);
  let cycleStdDev = baseline ? baseline.cycleLengthStdDev : 0;

  if (!baseline && completedCycles.length >= 3) {
    const lengths = completedCycles.map((c) => c.cycleLength as number);
    const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / lengths.length;
    cycleStdDev = Math.sqrt(variance);
  }

  if (completedCycles.length >= 3 && cycleStdDev > 5.0) {
    risks.push({
      id: 'risk_irregular_cycle',
      type: 'Cycle Variability Awareness',
      level: cycleStdDev > 7.0 ? 'high' : 'moderate',
      explanation: `Your completed cycles show significant variation with a standard deviation of ${cycleStdDev.toFixed(1)} days across ${completedCycles.length} tracked cycles. Recurring cycle variability is worth monitoring.`,
      contributingFactors: [
        `Historical cycle standard deviation of ±${cycleStdDev.toFixed(1)} days`,
        `${completedCycles.length} completed cycles analyzed`,
      ],
      suggestedAction:
        'Continue logging daily cycle dates and symptoms. If high cycle variability persists across subsequent months, consider reviewing the pattern with a doctor.',
      disclaimer: CLINICAL_DISCLAIMER,
    });
  }

  // -------------------------------------------------------------
  // Screening 3: Prolonged-Cycle Awareness
  // Criteria: Active cycle reaches Day 38+ or deviation >= 10 days
  // -------------------------------------------------------------
  if (currentCycleDay >= 38 || deviationDays >= 10) {
    risks.push({
      id: 'risk_prolonged_cycle',
      type: 'Prolonged Cycle Awareness',
      level: currentCycleDay >= 45 || deviationDays >= 14 ? 'high' : 'moderate',
      explanation: `Your current cycle has reached Day ${currentCycleDay}, which is ${deviationDays >= 0 ? '+' : ''}${deviationDays} days past your personal baseline average of ${baselineLength} days.`,
      contributingFactors: [
        `Active cycle day ${currentCycleDay}`,
        `${deviationDays} days deviation past personal baseline`,
      ],
      suggestedAction:
        'Take note of any accompanying lifestyle stressors or bodily changes. Consider consulting a healthcare provider if period onset continues to be substantially delayed.',
      disclaimer: CLINICAL_DISCLAIMER,
    });
  }

  return risks;
}
