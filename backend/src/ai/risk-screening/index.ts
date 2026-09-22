import { UserHealthSnapshot, RiskScreeningItem, SymptomRecord } from '../types';

/**
 * Risk-Awareness Screening Engine Stub
 * To be implemented by AI engineer: Non-diagnostic screening for anemia awareness, prolonged cycles, etc.
 */
export function screenHealthRisks(snapshot: UserHealthSnapshot): RiskScreeningItem[] {
  const risks: RiskScreeningItem[] = [];
  const fatigueSymptoms = snapshot.symptoms.filter((s: SymptomRecord) => s.type.toLowerCase() === 'fatigue');

  if (fatigueSymptoms.length >= 2 && fatigueSymptoms[0].severity >= 4) {
    risks.push({
      id: 'risk_anemia_awareness',
      type: 'Anemia Risk Awareness',
      level: 'moderate',
      explanation: 'Reported persistent fatigue alongside heavy flow suggests potential iron deficiency awareness.',
      disclaimer: 'This is an awareness indicator, not a medical diagnosis. Consult a healthcare provider.',
    });
  }

  return risks;
}
