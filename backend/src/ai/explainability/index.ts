import { EvidenceContract, UserHealthSnapshot, BaselineResult, PatternResult } from '../types';

/**
 * Explainability Engine Stub
 * To be implemented by AI engineer: Construct structured evidence contracts explaining WHY insights were generated.
 */
export function buildExplainabilityEvidence(
  snapshot: UserHealthSnapshot,
  baseline: BaselineResult,
  pattern: PatternResult
): EvidenceContract[] {
  const evidence: EvidenceContract[] = [];

  evidence.push({
    metric: 'Cycle Length',
    baselineValue: `${baseline.meanCycleLength} days`,
    currentValue: `Day ${pattern.currentCycleDay}`,
    difference: `${pattern.deviationDays >= 0 ? '+' : ''}${pattern.deviationDays} days`,
    unit: 'days',
    significance: Math.abs(pattern.deviationDays) >= 4 ? 'SIGNIFICANT' : 'NORMAL',
    explanation: `Current cycle is ${Math.abs(pattern.deviationDays)} days ${pattern.deviationDays >= 0 ? 'longer' : 'shorter'} than personal historical baseline.`,
  });

  return evidence;
}
