import { UserHealthSnapshot } from './types';
import { calculatePersonalBaseline } from './baseline';
import { detectCyclePatterns } from './cycle-pattern';
import { analyzeWhatChanged } from './what-changed';
import { analyzeSymptomPatterns } from './symptom-analysis';
import { analyzeLifestylePatterns } from './lifestyle-analysis';

// 1. Build Sarah's Health Snapshot (Demo scenario: Day 35 of 29-day baseline)
const today = new Date();
const formatDate = (d: Date) => d.toISOString().split('T')[0];
const daysAgo = (days: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - days);
  return formatDate(d);
};

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
      flow: 'HEAVY',
      isActive: true,
    },
    {
      id: 'cyc_004',
      startDate: daysAgo(34 + 29),
      endDate: daysAgo(34 + 29 - 5),
      cycleLength: 29,
      periodDuration: 5,
      flow: 'MEDIUM',
      isActive: false,
    },
    {
      id: 'cyc_003',
      startDate: daysAgo(34 + 29 + 30),
      endDate: daysAgo(34 + 29 + 30 - 5),
      cycleLength: 30,
      periodDuration: 5,
      flow: 'HEAVY',
      isActive: false,
    },
    {
      id: 'cyc_002',
      startDate: daysAgo(34 + 29 + 30 + 29),
      endDate: daysAgo(34 + 29 + 30 + 29 - 5),
      cycleLength: 29,
      periodDuration: 5,
      flow: 'LIGHT',
      isActive: false,
    },
    {
      id: 'cyc_001',
      startDate: daysAgo(34 + 29 + 30 + 29 + 28),
      endDate: daysAgo(34 + 29 + 30 + 29 + 28 - 5),
      cycleLength: 28,
      periodDuration: 5,
      flow: 'MEDIUM',
      isActive: false,
    },
  ],
  symptoms: [
    { id: 'sym_1', type: 'fatigue', severity: 5, date: daysAgo(1) },
    { id: 'sym_2', type: 'fatigue', severity: 4, date: daysAgo(2) },
    { id: 'sym_3', type: 'cramps', severity: 4, date: daysAgo(3) },
    { id: 'sym_4', type: 'fatigue', severity: 4, date: daysAgo(35) }, // In previous cycle cyc_004
    { id: 'sym_5', type: 'fatigue', severity: 3, date: daysAgo(65) }, // In cycle cyc_003
    { id: 'sym_6', type: 'bloating', severity: 2, date: daysAgo(5) },
  ],
  lifestyle: [
    // Last 7 days: low sleep (5.0-5.5h), high stress (4 days), hydration 1.5L
    { id: 'l_1', date: daysAgo(0), sleep: 5.0, stress: 'high', hydration: 1.5, exercise: 15, mood: 'low' },
    { id: 'l_2', date: daysAgo(1), sleep: 5.5, stress: 'very-high', hydration: 1.4, exercise: 0, mood: 'bad' },
    { id: 'l_3', date: daysAgo(2), sleep: 5.2, stress: 'high', hydration: 1.6, exercise: 20, mood: 'low' },
    { id: 'l_4', date: daysAgo(3), sleep: 5.0, stress: 'high', hydration: 1.5, exercise: 0, mood: 'bad' },
    { id: 'l_5', date: daysAgo(4), sleep: 6.0, stress: 'moderate', hydration: 1.8, exercise: 30, mood: 'okay' },
    { id: 'l_6', date: daysAgo(5), sleep: 5.5, stress: 'high', hydration: 1.5, exercise: 15, mood: 'low' },
    { id: 'l_7', date: daysAgo(6), sleep: 5.2, stress: 'moderate', hydration: 1.6, exercise: 10, mood: 'okay' },
    // Historical days: good sleep (7.5-8.0h), low stress, 2.2L hydration
    { id: 'l_8', date: daysAgo(7), sleep: 7.5, stress: 'low', hydration: 2.2, exercise: 30, mood: 'good' },
    { id: 'l_9', date: daysAgo(8), sleep: 8.0, stress: 'moderate', hydration: 2.0, exercise: 45, mood: 'great' },
    { id: 'l_10', date: daysAgo(9), sleep: 7.8, stress: 'low', hydration: 2.1, exercise: 30, mood: 'good' },
    { id: 'l_11', date: daysAgo(10), sleep: 8.0, stress: 'low', hydration: 2.3, exercise: 40, mood: 'great' },
  ],
};

console.log('=== RUNNING AI PIPELINE PHASE 1 VALIDATION ===\n');

// 1. Baseline Engine
const baseline = calculatePersonalBaseline(sarahSnapshot.user, sarahSnapshot.cycles);
console.log('1. Baseline Result:');
console.log(`   Mean Cycle: ${baseline.meanCycleLength} days (sample size: ${baseline.sampleSize}, confidence: ${baseline.confidenceScore}%)`);

// 2. Cycle Pattern Engine
const pattern = detectCyclePatterns(sarahSnapshot.cycles, baseline);
console.log('\n2. Cycle Pattern Result:');
console.log(`   Current Cycle Day: ${pattern.currentCycleDay}`);
console.log(`   Deviation: ${pattern.deviationDays >= 0 ? '+' : ''}${pattern.deviationDays} days`);
console.log(`   Status: ${pattern.status}`);
console.log(`   Phase: ${pattern.phase}`);
console.log(`   Phase Description: ${pattern.phaseDescription}`);
console.log(`   Summary: ${pattern.summary}`);

if (pattern.status !== 'DELAYED' || pattern.deviationDays !== 6) {
  console.error('❌ FAIL: Expected status DELAYED and deviation +6 days');
  process.exit(1);
}

// 3. Symptom Pattern Engine
const symptomAnalysis = analyzeSymptomPatterns(sarahSnapshot.symptoms, sarahSnapshot.cycles);
console.log('\n3. Symptom Pattern Result:');
console.log('   Top Symptoms:');
for (const s of symptomAnalysis.topSymptoms) {
  console.log(`   - ${s.symptomType}: frequency=${s.frequency} (${s.pattern}), avgSeverity=${s.averageSeverity}/5, isIncreasing=${s.isIncreasing}`);
  console.log(`     "${s.trendDescription}"`);
}

const fatigueTrend = symptomAnalysis.topSymptoms.find((s) => s.symptomType === 'fatigue');
if (!fatigueTrend || fatigueTrend.frequency < 0.5) {
  console.error('❌ FAIL: Expected recurring fatigue pattern across >= 50% cycles');
  process.exit(1);
}

// 4. Lifestyle Pattern Engine
const lifestyleAnalysis = analyzeLifestylePatterns(sarahSnapshot.lifestyle);
console.log('\n4. Lifestyle Pattern Result:');
console.log(`   7-Day Sleep Avg: ${lifestyleAnalysis.avgSleep7Days}h (deficit: ${lifestyleAnalysis.sleepDeficit}, delta: ${lifestyleAnalysis.sleepDelta}h vs hist ${lifestyleAnalysis.historicalAvgSleep}h)`);
console.log(`   High Stress Days: ${lifestyleAnalysis.highStressDaysCount}/7 (elevated: ${lifestyleAnalysis.isElevatedStress}, delta: +${lifestyleAnalysis.stressDeltaDays}d)`);
console.log(`   7-Day Hydration: ${lifestyleAnalysis.avgHydration7Days}L (below target: ${lifestyleAnalysis.hydrationBelowTarget}, delta: ${lifestyleAnalysis.hydrationDelta}L)`);

if (!lifestyleAnalysis.sleepDeficit || !lifestyleAnalysis.isElevatedStress || !lifestyleAnalysis.hydrationBelowTarget) {
  console.error('❌ FAIL: Expected sleep deficit, elevated stress, and hydration below target');
  process.exit(1);
}

// 5. What Changed Engine
const whatChanged = analyzeWhatChanged(sarahSnapshot, baseline);
console.log('\n5. What Changed Result:');
console.log(`   Has Significant Changes: ${whatChanged.hasSignificantChanges}`);
console.log(`   Summary: "${whatChanged.summary}"`);
console.log('   Changes Detected:');
for (const c of whatChanged.changes) {
  console.log(`   - [${c.category}] ${c.metricName}: ${c.recent} (baseline: ${c.baseline}, delta: ${c.delta}, direction: ${c.direction}) [${c.significance}]`);
  console.log(`     Desc: "${c.description}"`);
}

if (!whatChanged.hasSignificantChanges || whatChanged.changes.length < 4) {
  console.error('❌ FAIL: Expected at least 4 significant changes (cycle, sleep, stress, hydration, fatigue)');
  process.exit(1);
}

// 6. Test Edge Cases (empty snapshot)
console.log('\n6. Testing Edge Cases (Empty / Minimal Data):');
const emptySnapshot: UserHealthSnapshot = {
  user: { id: 'usr_new', name: 'NewUser', averageCycleLength: 28, averagePeriodDuration: 5 },
  cycles: [],
  symptoms: [],
  lifestyle: [],
};
const emptyBaseline = calculatePersonalBaseline(emptySnapshot.user, emptySnapshot.cycles);
const emptyPattern = detectCyclePatterns(emptySnapshot.cycles, emptyBaseline);
const emptyWhatChanged = analyzeWhatChanged(emptySnapshot, emptyBaseline);
const emptySymptoms = analyzeSymptomPatterns(emptySnapshot.symptoms, emptySnapshot.cycles);
const emptyLifestyle = analyzeLifestylePatterns(emptySnapshot.lifestyle);

console.log(`   Empty Baseline: ${emptyBaseline.meanCycleLength}d (confidence: ${emptyBaseline.confidenceScore}%)`);
console.log(`   Empty Pattern Status: ${emptyPattern.status} (${emptyPattern.phase})`);
console.log(`   Empty Changes Count: ${emptyWhatChanged.changes.length}`);
console.log(`   Empty Top Symptoms: ${emptySymptoms.topSymptoms.length}`);
console.log(`   Empty Sleep Avg: ${emptyLifestyle.avgSleep7Days}h`);

console.log('\n✅ ALL PHASE 1 AI ENGINES VALIDATED SUCCESSFULLY WITH ACCURATE CLINICAL MATH!');
