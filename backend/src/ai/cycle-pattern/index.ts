import { CycleRecord, BaselineResult, PatternResult, CyclePhase } from '../types';
import { calculateDaysDifference, formatDateToISO } from '../dataPreparation';

/**
 * Cycle Pattern & Phase Engine
 * Pure mathematical analysis of active cycle progression against personal baseline.
 * Classifies cycle variance status and biological cycle phase.
 */
export function detectCyclePatterns(
  cycles: CycleRecord[],
  baseline: BaselineResult
): PatternResult {
  const todayStr = formatDateToISO(new Date());

  // 1. Resolve active or most recent cycle
  const activeCycle = cycles.find((c) => c.isActive) || cycles[0];
  const baselineLength = Math.max(20, Math.round(baseline.meanCycleLength || 28));
  const periodDuration = Math.max(1, Math.round(baseline.meanPeriodDuration || 5));

  // 2. Compute current cycle day
  let currentCycleDay = 1;
  if (activeCycle && activeCycle.startDate) {
    currentCycleDay = calculateDaysDifference(activeCycle.startDate, todayStr);
  }

  const deviationDays = currentCycleDay - baselineLength;

  // 3. Evaluate historical cycle variance (irregularity screening)
  const completedCycles = cycles.filter((c) => !c.isActive && c.cycleLength && c.cycleLength > 0);
  let isVariabilityHigh = false;
  if (completedCycles.length >= 3) {
    const lengths = completedCycles.map((c) => c.cycleLength as number);
    const maxLen = Math.max(...lengths);
    const minLen = Math.min(...lengths);
    const spread = maxLen - minLen;
    // Standard deviation >= 4.5 or spread >= 8 days across recent cycles denotes high variability
    if (baseline.cycleLengthStdDev >= 4.5 || spread >= 8) {
      isVariabilityHigh = true;
    }
  }

  // 4. Classify status
  const isDelayed = deviationDays >= 4;
  const isEarly = deviationDays <= -4;

  let status: 'REGULAR' | 'DELAYED' | 'EARLY' | 'IRREGULAR';
  if (isDelayed) {
    status = 'DELAYED';
  } else if (isEarly) {
    status = 'EARLY';
  } else if (isVariabilityHigh) {
    status = 'IRREGULAR';
  } else {
    status = 'REGULAR';
  }

  // 5. Determine Current Cycle Phase
  // Standard physiological model individualized to user's baseline cycle length:
  // - Menstrual: Days 1 to periodDuration (default 1 to 5)
  // - Follicular: Days (periodDuration + 1) to (ovulationStart - 1)
  // - Ovulation: 4-day fertile window centered around (baselineLength - 14)
  // - Luteal: Post-ovulation until cycle end or extended delayed days
  const estimatedOvulationDay = Math.max(periodDuration + 3, baselineLength - 14);
  const ovulationWindowStart = Math.max(periodDuration + 1, estimatedOvulationDay - 2);
  const ovulationWindowEnd = estimatedOvulationDay + 1;

  let phase: CyclePhase;
  let phaseDescription: string;

  if (currentCycleDay <= periodDuration) {
    phase = 'MENSTRUAL';
    phaseDescription = `Menstrual Phase (Day ${currentCycleDay} of ~${periodDuration} days of flow). Rest and iron-rich hydration are supported.`;
  } else if (currentCycleDay < ovulationWindowStart) {
    phase = 'FOLLICULAR';
    phaseDescription = `Follicular Phase (Days ${periodDuration + 1}–${ovulationWindowStart - 1}). Estrogen rising; energy levels typically building.`;
  } else if (currentCycleDay >= ovulationWindowStart && currentCycleDay <= ovulationWindowEnd) {
    phase = 'OVULATION';
    phaseDescription = `Ovulation Window (Estimated Days ${ovulationWindowStart}–${ovulationWindowEnd}). Peak estrogen and LH surge window.`;
  } else {
    phase = 'LUTEAL';
    if (currentCycleDay > baselineLength) {
      phaseDescription = `Extended Luteal Phase (Day ${currentCycleDay}, +${deviationDays}d past baseline). Monitoring for period onset or cycle shift.`;
    } else {
      phaseDescription = `Luteal Phase (Days ${ovulationWindowEnd + 1}–${baselineLength}). Progesterone dominant; common time for PMS or energy fluctuations.`;
    }
  }

  // 6. Formulate summary
  let summary = '';
  if (isDelayed) {
    summary = `Cycle Day ${currentCycleDay} (+${deviationDays}d vs ${baselineLength}d personal baseline) — Pattern change detected`;
  } else if (isEarly) {
    summary = `Cycle Day ${currentCycleDay} (${deviationDays}d vs ${baselineLength}d personal baseline) — Cycle earlier than typical`;
  } else if (status === 'IRREGULAR') {
    summary = `Cycle Day ${currentCycleDay} (${baselineLength}d baseline) — Variable cycle pattern across tracked history`;
  } else {
    summary = `Cycle Day ${currentCycleDay} of ${baselineLength}d baseline — Rhythm on track`;
  }

  return {
    currentCycleDay,
    deviationDays,
    isDelayed,
    isEarly,
    status,
    summary,
    phase,
    phaseDescription,
    isVariabilityHigh,
  };
}
