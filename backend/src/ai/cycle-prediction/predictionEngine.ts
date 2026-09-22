import { CycleRecord, BaselineResult, PredictionResult } from '../types';
import { calculateDaysDifference, formatDateToISO } from '../dataPreparation';

/**
 * Cycle Prediction Engine
 * Computes next period start estimation window based on baseline and active cycle progression.
 */
export function predictCycleWindow(
  cycles: CycleRecord[],
  baseline: BaselineResult
): PredictionResult {
  const today = new Date();
  const todayStr = formatDateToISO(today);

  const activeCycle = cycles.find((c) => c.isActive) || cycles[0];
  const expectedCycleLength = Math.round(baseline.meanCycleLength);

  let predictedDate: Date;
  let confidence = baseline.confidenceScore;
  let basedOn = `Based on your personal historical baseline of ${expectedCycleLength} days across ${baseline.sampleSize} tracked cycles.`;

  if (activeCycle) {
    const currentDay = calculateDaysDifference(activeCycle.startDate, todayStr);

    if (currentDay >= expectedCycleLength) {
      const daysAhead = 2;
      predictedDate = new Date(today);
      predictedDate.setDate(predictedDate.getDate() + daysAhead);
      confidence = Math.max(50, Math.round(baseline.confidenceScore - (currentDay - expectedCycleLength) * 3));
      basedOn = `Based on baseline average of ${expectedCycleLength} days, adjusted for current cycle day ${currentDay} and lifestyle trends.`;
    } else {
      const remainingDays = expectedCycleLength - currentDay;
      predictedDate = new Date(today);
      predictedDate.setDate(predictedDate.getDate() + remainingDays);
      confidence = baseline.confidenceScore;
    }
  } else {
    predictedDate = new Date(today);
    predictedDate.setDate(predictedDate.getDate() + expectedCycleLength);
  }

  const windowStart = new Date(predictedDate);
  windowStart.setDate(windowStart.getDate() - 2);

  const windowEnd = new Date(predictedDate);
  windowEnd.setDate(windowEnd.getDate() + 2);

  return {
    predictedStartDate: formatDateToISO(predictedDate),
    estimatedWindowStart: formatDateToISO(windowStart),
    estimatedWindowEnd: formatDateToISO(windowEnd),
    confidence,
    basedOn,
  };
}
