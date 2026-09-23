import { UserHealthSnapshot } from './types';
import { evaluateUserHealthSnapshot } from './index';
import { screenHealthRisks } from './risk-screening';
import { buildExplainabilityEvidence } from './explainability';
import { generateHealthInsights } from './insight-generation';

const today = new Date();
const formatDate = (d: Date) => d.toISOString().split('T')[0];
const daysAgo = (days: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - days);
  return formatDate(d);
};

// 1. Build Sarah's Demo Health Snapshot (Day 35 of 29-day baseline)
const sarahSnapshot: UserHealthSnapshot = {
  user: {
    id: 'usr_001',
    name: 'Sarah',
    averageCycleLength: 29,
    averagePeriodDuration: 5,
  },
  cycles: [
    {
      id: 'cyc_005',
      startDate: daysAgo(34), // Day 35
      endDate: null,
      cycleLength: null,
      periodDuration: 5,
      flow: JSON.stringify(['medium', 'heavy', 'heavy', 'medium', 'light']),
      isActive: true,
    },
    {
      id: 'cyc_004',
      startDate: daysAgo(34 + 29),
      endDate: daysAgo(34 + 29 - 5),
      cycleLength: 29,
      periodDuration: 5,
      flow: JSON.stringify(['light', 'medium', 'medium', 'light', 'spotting']),
      isActive: false,
    },
    {
      id: 'cyc_003',
      startDate: daysAgo(34 + 29 + 30),
      endDate: daysAgo(34 + 29 + 30 - 5),
      cycleLength: 30,
      periodDuration: 5,
      flow: JSON.stringify(['medium', 'medium', 'heavy', 'medium', 'light']),
      isActive: false,
    },
    {
      id: 'cyc_002',
      startDate: daysAgo(34 + 29 + 30 + 29),
      endDate: daysAgo(34 + 29 + 30 + 29 - 5),
      cycleLength: 29,
      periodDuration: 5,
      flow: JSON.stringify(['light', 'medium', 'medium', 'light', 'spotting']),
      isActive: false,
    },
    {
      id: 'cyc_001',
      startDate: daysAgo(34 + 29 + 30 + 29 + 28),
      endDate: daysAgo(34 + 29 + 30 + 29 + 28 - 5),
      cycleLength: 28,
      periodDuration: 5,
      flow: JSON.stringify(['medium', 'heavy', 'medium', 'light', 'spotting']),
      isActive: false,
    },
  ],
  symptoms: [
    { id: 'sym_1', type: 'fatigue', severity: 5, date: daysAgo(1) },
    { id: 'sym_2', type: 'fatigue', severity: 4, date: daysAgo(2) },
    { id: 'sym_3', type: 'cramps', severity: 4, date: daysAgo(3) },
    { id: 'sym_4', type: 'fatigue', severity: 4, date: daysAgo(35) },
    { id: 'sym_5', type: 'fatigue', severity: 3, date: daysAgo(65) },
  ],
  lifestyle: [
    { id: 'l_1', date: daysAgo(0), sleep: 5.0, stress: 'high', hydration: 1.5, exercise: 15, mood: 'low' },
    { id: 'l_2', date: daysAgo(1), sleep: 5.5, stress: 'very-high', hydration: 1.4, exercise: 0, mood: 'bad' },
    { id: 'l_3', date: daysAgo(2), sleep: 5.2, stress: 'high', hydration: 1.6, exercise: 20, mood: 'low' },
    { id: 'l_4', date: daysAgo(3), sleep: 5.0, stress: 'high', hydration: 1.5, exercise: 0, mood: 'bad' },
    { id: 'l_5', date: daysAgo(4), sleep: 6.0, stress: 'moderate', hydration: 1.8, exercise: 30, mood: 'okay' },
    { id: 'l_6', date: daysAgo(5), sleep: 5.5, stress: 'high', hydration: 1.5, exercise: 15, mood: 'low' },
    { id: 'l_7', date: daysAgo(6), sleep: 5.2, stress: 'moderate', hydration: 1.6, exercise: 10, mood: 'okay' },
    { id: 'l_8', date: daysAgo(7), sleep: 7.5, stress: 'low', hydration: 2.2, exercise: 30, mood: 'good' },
    { id: 'l_9', date: daysAgo(8), sleep: 8.0, stress: 'moderate', hydration: 2.0, exercise: 45, mood: 'great' },
  ],
};

console.log('=== RUNNING AI PIPELINE PHASE 2 VALIDATION ===\n');

// 1. Run Full End-to-End Orchestrated Pipeline
const output = evaluateUserHealthSnapshot(sarahSnapshot);

console.log('1. Risk Screening Results:');
console.log(`   Total Risks Screened: ${output.riskScreening.length}`);
for (const r of output.riskScreening) {
  console.log(`   - [${r.level.toUpperCase()}] ${r.type}`);
  console.log(`     Explanation: "${r.explanation}"`);
  console.log(`     Disclaimer: "${r.disclaimer}"`);
}

// Verify Anemia-Risk Awareness was triggered
const anemiaRisk = output.riskScreening.find((r) => r.type.includes('Anemia'));
if (!anemiaRisk) {
  console.error('❌ FAIL: Expected Anemia Risk Awareness to trigger for Sarah');
  process.exit(1);
}
if (!anemiaRisk.disclaimer.includes('not a clinical diagnosis')) {
  console.error('❌ FAIL: Missing mandatory non-diagnostic disclaimer in anemia risk');
  process.exit(1);
}

// 2. Test Irregular Cycle Screening (sigma > 5 days)
console.log('\n2. Testing Irregular Cycle Awareness Screening:');
const irregularSnapshot: UserHealthSnapshot = {
  ...sarahSnapshot,
  cycles: [
    { id: 'c_irr_1', startDate: daysAgo(10), cycleLength: null, isActive: true },
    { id: 'c_irr_2', startDate: daysAgo(45), cycleLength: 35, isActive: false },
    { id: 'c_irr_3', startDate: daysAgo(65), cycleLength: 20, isActive: false },
    { id: 'c_irr_4', startDate: daysAgo(108), cycleLength: 43, isActive: false },
    { id: 'c_irr_5', startDate: daysAgo(135), cycleLength: 27, isActive: false },
  ],
};
const irregularRisks = screenHealthRisks(irregularSnapshot);
const irrRisk = irregularRisks.find((r) => r.type.includes('Variability'));
console.log(`   Irregular Risk Triggered: ${irrRisk ? 'YES' : 'NO'}`);
if (irrRisk) {
  console.log(`   - ${irrRisk.type}: "${irrRisk.explanation}"`);
  console.log(`     Disclaimer: "${irrRisk.disclaimer}"`);
}
if (!irrRisk) {
  console.error('❌ FAIL: Expected Cycle Variability Awareness to trigger for highly fluctuating cycles');
  process.exit(1);
}

// 3. Test Prolonged Cycle Screening (Day 38+ or deviation >= 10d)
console.log('\n3. Testing Prolonged Cycle Awareness Screening:');
const prolongedSnapshot: UserHealthSnapshot = {
  ...sarahSnapshot,
  cycles: [
    { id: 'c_prolonged', startDate: daysAgo(41), cycleLength: null, isActive: true }, // Day 42
    sarahSnapshot.cycles[1],
    sarahSnapshot.cycles[2],
    sarahSnapshot.cycles[3],
  ],
};
const prolongedRisks = screenHealthRisks(prolongedSnapshot);
const prolongRisk = prolongedRisks.find((r) => r.type.includes('Prolonged'));
console.log(`   Prolonged Risk Triggered: ${prolongRisk ? 'YES' : 'NO'}`);
if (prolongRisk) {
  console.log(`   - ${prolongRisk.type} (${prolongRisk.level}): "${prolongRisk.explanation}"`);
}
if (!prolongRisk) {
  console.error('❌ FAIL: Expected Prolonged Cycle Awareness to trigger for cycle day 42');
  process.exit(1);
}

// 4. Test Explainability Evidence Contracts
console.log('\n4. Explainability Evidence Contracts:');
console.log(`   Total Evidence Contracts Built: ${output.evidence.length}`);
for (const ev of output.evidence) {
  console.log(`   - [${ev.significance}] ${ev.metric}: ${ev.currentValue} vs baseline ${ev.baselineValue} (${ev.difference})`);
  console.log(`     Reasoning: "${ev.explanation}"`);
}

if (output.evidence.length < 4) {
  console.error('❌ FAIL: Expected at least 4 structured evidence contracts');
  process.exit(1);
}

// 5. Test Consolidated Dashboard Insights
console.log('\n5. Consolidated Dashboard Insights:');
console.log(`   Total Insights: ${output.insights.length}`);
const primaryHero = output.insights.find((i) => i.isPrimary);
if (!primaryHero) {
  console.error('❌ FAIL: Expected primary hero dashboard insight');
  process.exit(1);
}
console.log(`   Primary Hero Insight:`);
console.log(`   - Title: "${primaryHero.title}" [${primaryHero.severity.toUpperCase()}]`);
console.log(`   - Description: "${primaryHero.description}"`);
console.log(`   - Actionable Step: "${primaryHero.actionableStep}"`);
console.log(`   - Attached Evidence Count: ${primaryHero.evidence?.length || 0}`);

for (const sec of output.insights.filter((i) => !i.isPrimary)) {
  console.log(`   Secondary Insight [${sec.category}]: "${sec.title}" — "${sec.description}"`);
}

console.log('\n✅ ALL PHASE 2 AI ENGINES VALIDATED SUCCESSFULLY WITH CLINICAL SAFETY AND EXPLAINABILITY!');
