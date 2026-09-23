import { AlertItem, PatternResult, EvidenceContract } from '../types';

/**
 * Smart Alerts Engine
 * Non-alarmist evaluation of cycle deviation patterns.
 * Fires MEDIUM-priority alert when current cycle exceeds baseline by 7+ days.
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
