import { prisma } from '../config/db';
import { generateAssistantResponse } from '../services/geminiService';
import { fetchUserHealthSnapshot, evaluateUserHealthSnapshot, generateHealthSummaryReport } from './index';

async function runPhase3Validation() {
  console.log('=== RUNNING PHASE 3 END-TO-END INTEGRATION TEST ===\n');

  // 1. Fetch Sarah from SQLite database
  const user = await prisma.user.findUnique({
    where: { email: 'sarah@ritora.app' },
  });

  if (!user) {
    console.error('❌ User Sarah not found in database! Seed first.');
    process.exit(1);
  }
  console.log(`1. Found user in SQLite: ${user.name} (${user.id})`);

  // 2. Fetch User Health Snapshot via dataPreparation layer
  const snapshot = await fetchUserHealthSnapshot(user.id);
  if (!snapshot) {
    console.error('❌ Failed to fetch user health snapshot');
    process.exit(1);
  }
  console.log(`2. Snapshot fetched:`);
  console.log(`   - Cycles: ${snapshot.cycles.length} (Active: ${snapshot.cycles.find((c) => c.isActive)?.id})`);
  console.log(`   - Symptoms: ${snapshot.symptoms.length}`);
  console.log(`   - Lifestyle: ${snapshot.lifestyle.length}`);

  // 3. Execute Unified Modular AI Pipeline
  const pipeline = evaluateUserHealthSnapshot(snapshot);
  console.log(`3. Pipeline Evaluated:`);
  console.log(`   - Cycle Day: ${pipeline.pattern.currentCycleDay} (${pipeline.pattern.status}, ${pipeline.pattern.phase})`);
  console.log(`   - Deviation: ${pipeline.pattern.deviationDays >= 0 ? '+' : ''}${pipeline.pattern.deviationDays} days`);
  console.log(`   - What Changed: ${pipeline.whatChanged.changes.length} changes detected`);
  console.log(`   - Top Symptoms: ${pipeline.symptomAnalysis.topSymptoms.map((s) => s.symptomType).join(', ')}`);
  console.log(`   - Risks Screened: ${pipeline.riskScreening.map((r) => r.type).join(', ') || 'None'}`);
  console.log(`   - Primary Insight: "${pipeline.insights[0]?.title}" [${pipeline.insights[0]?.severity}]`);

  // Verify core expectations
  if (pipeline.pattern.currentCycleDay !== 35 || pipeline.pattern.deviationDays !== 6) {
    console.error('❌ Expected Day 35 and deviation +6');
    process.exit(1);
  }
  if (!pipeline.riskScreening.some((r) => r.type.includes('Anemia'))) {
    console.error('❌ Expected Anemia Risk Awareness to trigger');
    process.exit(1);
  }

  // 4. Test Assistant Chat grounded response
  console.log('\n4. Testing Data-Grounded AI Assistant:');
  const userQuestions = [
    'Why is my cycle longer this month?',
    'What changed from last month?',
    'What symptoms have I had recently?',
  ];

  for (const q of userQuestions) {
    console.log(`   Q: "${q}"`);
    const reply = await generateAssistantResponse(user.id, q);
    console.log(`   A: ${reply.split('\n')[0]}`);
    console.log(`      (Length: ${reply.length} chars, includes disclaimer: ${reply.toLowerCase().includes('disclaimer')})`);
  }

  // 5. Test Report Generation
  console.log('\n5. Testing Health Summary Report Generation:');
  const report = generateHealthSummaryReport(snapshot, pipeline, 'monthly');
  console.log(`   Title: "${report.title}"`);
  console.log(`   Summary: "${report.summary}"`);
  console.log(`   Completed Cycles Count: ${report.data.cycleCount}`);
  console.log(`   Common Symptoms: ${report.data.commonSymptoms.map((s: any) => `${s.type} (${s.frequency}%)`).join(', ')}`);
  console.log(`   Lifestyle Averages: Sleep ${report.data.lifestyleAverages.sleep}h, Stress ${report.data.lifestyleAverages.stress}`);

  console.log('\n✅ PHASE 3 CONTROLLER & PIPELINE INTEGRATION VERIFIED WITH 100% REAL DATABASE DATA!');
}

runPhase3Validation()
  .catch((err) => {
    console.error('Test error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
