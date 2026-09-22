import { CycleRecord, BaselineResult, UserProfileSnapshot } from '../types';

/**
 * Baseline Engine
 * Computes individual user baseline metrics based on historical cycle records.
 */
export function calculatePersonalBaseline(
  user: UserProfileSnapshot,
  cycles: CycleRecord[]
): BaselineResult {
  const completedCycles = cycles.filter((c) => !c.isActive && c.cycleLength && c.cycleLength > 0);
  const sampleSize = completedCycles.length;

  if (sampleSize === 0) {
    return {
      meanCycleLength: user.averageCycleLength || 28,
      medianCycleLength: user.averageCycleLength || 28,
      cycleLengthStdDev: 1.5,
      meanPeriodDuration: user.averagePeriodDuration || 5,
      confidenceScore: 50,
      sampleSize: 0,
    };
  }

  const lengths = completedCycles.map((c) => c.cycleLength as number);
  const durations = completedCycles.map((c) => c.periodDuration || user.averagePeriodDuration || 5);

  const meanCycle = lengths.reduce((acc, val) => acc + val, 0) / lengths.length;
  const meanDuration = durations.reduce((acc, val) => acc + val, 0) / durations.length;

  const sortedLengths = [...lengths].sort((a, b) => a - b);
  const mid = Math.floor(sortedLengths.length / 2);
  const medianCycle =
    sortedLengths.length % 2 !== 0
      ? sortedLengths[mid]
      : (sortedLengths[mid - 1] + sortedLengths[mid]) / 2;

  const variance =
    lengths.reduce((acc, val) => acc + Math.pow(val - meanCycle, 2), 0) / lengths.length;
  const stdDev = Math.sqrt(variance);

  const confidenceScore = Math.min(95, 60 + sampleSize * 7);

  return {
    meanCycleLength: Math.round(meanCycle * 10) / 10,
    medianCycleLength: Math.round(medianCycle * 10) / 10,
    cycleLengthStdDev: Math.round(stdDev * 10) / 10,
    meanPeriodDuration: Math.round(meanDuration * 10) / 10,
    confidenceScore: Math.round(confidenceScore),
    sampleSize,
  };
}
