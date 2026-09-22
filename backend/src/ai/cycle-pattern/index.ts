import { CycleRecord, BaselineResult, PatternResult } from '../types';
import { calculateDaysDifference, formatDateToISO } from '../dataPreparation';

/**
 * Cycle Pattern Engine Stub
 * To be implemented by AI engineer.
 */
export function detectCyclePatterns(
  cycles: CycleRecord[],
  baseline: BaselineResult
): PatternResult {
  const todayStr = formatDateToISO(new Date());
  const activeCycle = cycles.find((c) => c.isActive) || cycles[0];
  const currentCycleDay = activeCycle ? calculateDaysDifference(activeCycle.startDate, todayStr) : 1;
  const baselineLength = Math.round(baseline.meanCycleLength);
  const deviationDays = currentCycleDay - baselineLength;

  return {
    currentCycleDay,
    deviationDays,
    isDelayed: deviationDays >= 4,
    isEarly: deviationDays <= -4,
    status: deviationDays >= 4 ? 'DELAYED' : 'REGULAR',
    summary: `Cycle Day ${currentCycleDay} (${deviationDays >= 0 ? '+' : ''}${deviationDays}d vs ${baselineLength}d baseline)`,
  };
}
