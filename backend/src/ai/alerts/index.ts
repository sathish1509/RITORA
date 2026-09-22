import { AlertItem, PatternResult, EvidenceContract } from '../types';

/**
 * Smart Alerts Engine Stub
 * To be implemented by AI engineer: Non-alarmist smart alert evaluation.
 */
export function evaluateSmartAlerts(
  pattern: PatternResult,
  evidence: EvidenceContract[]
): AlertItem[] {
  const alerts: AlertItem[] = [];
  const todayStr = new Date().toISOString().split('T')[0];

  if (pattern.deviationDays >= 7) {
    alerts.push({
      id: 'alert_cycle_delay_7d',
      priority: 'MEDIUM',
      title: 'Extended Cycle Phase',
      message: `Your current cycle is 7+ days past your typical baseline length.`,
      evidence,
      createdAt: todayStr,
    });
  }

  return alerts;
}
