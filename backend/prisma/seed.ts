import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const today = new Date();
const formatDate = (d: Date) => d.toISOString().split('T')[0];

function daysAgo(days: number): string {
  const d = new Date(today);
  d.setDate(d.getDate() - days);
  return formatDate(d);
}

async function main() {
  console.log('🌱 Seeding RITORA database...');

  // Clean existing data
  await prisma.chatMessage.deleteMany();
  await prisma.report.deleteMany();
  await prisma.prediction.deleteMany();
  await prisma.riskIndicator.deleteMany();
  await prisma.healthInsight.deleteMany();
  await prisma.lifestyleEntry.deleteMany();
  await prisma.symptom.deleteMany();
  await prisma.cycle.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Demo User: Sarah
  const passwordHash = await bcrypt.hash('demo1234', 10);
  const user = await prisma.user.create({
    data: {
      id: 'usr_001',
      email: 'sarah@ritora.app',
      name: 'Sarah',
      age: 24,
      passwordHash,
      averageCycleLength: 29,
      averagePeriodDuration: 5,
      lastPeriodStart: daysAgo(34),
    },
  });

  console.log(`👤 Created user: ${user.name} (${user.email})`);

  // 2. Create Cycles
  const cyclesData = [
    {
      id: 'cyc_005',
      startDate: daysAgo(34),
      endDate: null,
      cycleLength: null,
      periodDuration: 5,
      flow: JSON.stringify(['medium', 'heavy', 'heavy', 'medium', 'light']),
      isActive: true,
      isRegular: false,
      notes: 'Current active cycle — delayed by 6 days so far',
    },
    {
      id: 'cyc_004',
      startDate: daysAgo(34 + 29),
      endDate: daysAgo(34 + 29 - 5),
      cycleLength: 29,
      periodDuration: 5,
      flow: JSON.stringify(['light', 'medium', 'medium', 'light', 'spotting']),
      isActive: false,
      isRegular: true,
    },
    {
      id: 'cyc_003',
      startDate: daysAgo(34 + 29 + 30),
      endDate: daysAgo(34 + 29 + 30 - 5),
      cycleLength: 30,
      periodDuration: 5,
      flow: JSON.stringify(['medium', 'medium', 'heavy', 'medium', 'light']),
      isActive: false,
      isRegular: true,
    },
    {
      id: 'cyc_002',
      startDate: daysAgo(34 + 29 + 30 + 29),
      endDate: daysAgo(34 + 29 + 30 + 29 - 5),
      cycleLength: 29,
      periodDuration: 5,
      flow: JSON.stringify(['light', 'medium', 'medium', 'light', 'spotting']),
      isActive: false,
      isRegular: true,
    },
    {
      id: 'cyc_001',
      startDate: daysAgo(34 + 29 + 30 + 29 + 28),
      endDate: daysAgo(34 + 29 + 30 + 29 + 28 - 5),
      cycleLength: 28,
      periodDuration: 5,
      flow: JSON.stringify(['medium', 'heavy', 'medium', 'light', 'spotting']),
      isActive: false,
      isRegular: true,
    },
  ];

  for (const c of cyclesData) {
    await prisma.cycle.create({
      data: {
        id: c.id,
        userId: user.id,
        startDate: c.startDate,
        endDate: c.endDate,
        cycleLength: c.cycleLength,
        periodDuration: c.periodDuration,
        flow: c.flow,
        isActive: c.isActive,
        isRegular: c.isRegular,
        notes: c.notes,
      },
    });
  }

  console.log(`🔄 Seeded ${cyclesData.length} cycles`);

  // 3. Create Symptoms
  const symptomsData = [
    { type: 'fatigue', severity: 4, date: daysAgo(0), notes: 'Very low energy during work' },
    { type: 'cramps', severity: 3, date: daysAgo(0) },
    { type: 'fatigue', severity: 4, date: daysAgo(1) },
    { type: 'cramps', severity: 4, date: daysAgo(1) },
    { type: 'bloating', severity: 2, date: daysAgo(1) },
    { type: 'fatigue', severity: 3, date: daysAgo(2) },
    { type: 'headache', severity: 2, date: daysAgo(2) },
    { type: 'mood-swings', severity: 3, date: daysAgo(3) },
    { type: 'cramps', severity: 2, date: daysAgo(3) },
    { type: 'back-pain', severity: 3, date: daysAgo(4) },
    { type: 'insomnia', severity: 3, date: daysAgo(5) },
    { type: 'breast-tenderness', severity: 2, date: daysAgo(6) },
    { type: 'anxiety', severity: 2, date: daysAgo(7) },
    { type: 'cravings', severity: 3, date: daysAgo(8) },
    { type: 'acne', severity: 2, date: daysAgo(10) },
  ];

  for (const s of symptomsData) {
    await prisma.symptom.create({
      data: {
        userId: user.id,
        cycleId: 'cyc_005',
        type: s.type,
        severity: s.severity,
        date: s.date,
        notes: s.notes,
      },
    });
  }

  console.log(`🩺 Seeded ${symptomsData.length} symptoms`);

  // 4. Create Lifestyle Entries
  const lifestyleData = [
    { date: daysAgo(0), sleep: 5.0, stress: 'high', hydration: 1.5, exercise: 20, mood: 'low' },
    { date: daysAgo(1), sleep: 5.5, stress: 'high', hydration: 1.2, exercise: 0, mood: 'low' },
    { date: daysAgo(2), sleep: 4.5, stress: 'very-high', hydration: 1.8, exercise: 15, mood: 'bad' },
    { date: daysAgo(3), sleep: 6.0, stress: 'high', hydration: 2.0, exercise: 30, mood: 'okay' },
    { date: daysAgo(4), sleep: 5.0, stress: 'moderate', hydration: 1.5, exercise: 25, mood: 'okay' },
    { date: daysAgo(5), sleep: 6.5, stress: 'moderate', hydration: 2.2, exercise: 40, mood: 'good' },
    { date: daysAgo(6), sleep: 7.0, stress: 'low', hydration: 2.5, exercise: 45, mood: 'great' },
    { date: daysAgo(7), sleep: 6.0, stress: 'moderate', hydration: 2.0, exercise: 30, mood: 'good' },
    { date: daysAgo(8), sleep: 5.5, stress: 'high', hydration: 1.8, exercise: 15, mood: 'okay' },
    { date: daysAgo(9), sleep: 7.5, stress: 'low', hydration: 2.5, exercise: 50, mood: 'great' },
    { date: daysAgo(10), sleep: 6.0, stress: 'moderate', hydration: 2.0, exercise: 35, mood: 'good' },
    { date: daysAgo(11), sleep: 5.0, stress: 'high', hydration: 1.5, exercise: 10, mood: 'low' },
    { date: daysAgo(12), sleep: 6.5, stress: 'moderate', hydration: 2.3, exercise: 40, mood: 'good' },
    { date: daysAgo(13), sleep: 7.0, stress: 'low', hydration: 2.5, exercise: 45, mood: 'great' },
  ];

  for (const l of lifestyleData) {
    await prisma.lifestyleEntry.create({
      data: {
        userId: user.id,
        date: l.date,
        sleep: l.sleep,
        stress: l.stress,
        hydration: l.hydration,
        exercise: l.exercise,
        mood: l.mood,
      },
    });
  }

  console.log(`🥗 Seeded ${lifestyleData.length} lifestyle logs`);

  // 5. Create Health Insights
  const insightsData = [
    {
      title: 'Pattern Change Detected',
      description:
        'Your current cycle is at day 35, which is 6 days longer than your personal average of 29 days. Recent changes in sleep, stress, and symptoms are also visible in your recent records. This could be related to your elevated stress levels and reduced sleep over the past week.',
      severity: 'warning',
      category: 'pattern-change',
      icon: 'alert-triangle',
      actionableStep: 'Consider practicing 10 minutes of evening mindfulness and maintaining a consistent bedtime.',
    },
    {
      title: 'Sleep & Cycle Correlation',
      description:
        'Your average sleep over the last 7 days is 5.5 hours, which is below the recommended 7-9 hours. Research shows that sleep deprivation can affect menstrual cycle regularity. Consider improving your sleep hygiene to support cycle health.',
      severity: 'info',
      category: 'lifestyle-correlation',
      icon: 'moon',
      actionableStep: 'Aim for at least 7 hours of sleep tonight.',
    },
    {
      title: 'Stress Impact Analysis',
      description:
        'Your stress levels have been elevated (high to very-high) for 5 of the last 7 days. Chronic stress is associated with delayed ovulation and longer cycles. The current cycle extension may be partially attributed to this pattern.',
      severity: 'warning',
      category: 'lifestyle-correlation',
      icon: 'brain',
      actionableStep: 'Schedule short relaxation breaks during your workday.',
    },
    {
      title: 'Symptom Trend: Fatigue Increasing',
      description:
        'Fatigue has been reported with increasing severity over the past 3 days (severity 3 → 4 → 4). Combined with heavy flow and low sleep, this may indicate your body needs more rest and iron-rich nutrition.',
      severity: 'info',
      category: 'symptom-trend',
      icon: 'battery-low',
      actionableStep: 'Incorporate iron-rich foods like spinach, lentils, or lean meats.',
    },
    {
      title: 'Hydration Below Target',
      description:
        'Your average water intake is 1.5L per day this week, below the recommended 2L minimum. Adequate hydration can help reduce bloating and improve overall cycle comfort.',
      severity: 'info',
      category: 'lifestyle-correlation',
      icon: 'droplets',
      actionableStep: 'Keep a water bottle handy and track intake.',
    },
  ];

  for (const ins of insightsData) {
    await prisma.healthInsight.create({
      data: {
        userId: user.id,
        title: ins.title,
        description: ins.description,
        severity: ins.severity,
        category: ins.category,
        icon: ins.icon,
        actionableStep: ins.actionableStep,
      },
    });
  }

  console.log(`✨ Seeded ${insightsData.length} insights`);

  // 6. Create Risk Indicators
  const riskData = [
    {
      type: 'Anemia Risk',
      level: 'moderate',
      explanation:
        'Based on your reported heavy flow, fatigue, and reduced iron-rich food intake, there is a moderate awareness level for potential iron-deficiency anemia. Heavy menstrual bleeding is one of the most common causes of iron deficiency in premenopausal women.',
      disclaimer: 'This is an awareness indicator, not a medical diagnosis. Please consult a healthcare provider for proper evaluation.',
    },
    {
      type: 'Stress-Related Cycle Disruption',
      level: 'moderate',
      explanation:
        'Prolonged high stress levels can affect your hypothalamic-pituitary-ovarian axis, potentially delaying ovulation and extending your cycle. Your current +6 day deviation aligns with your elevated stress pattern.',
      disclaimer: 'This is an awareness indicator, not a medical diagnosis. Please consult a healthcare provider for proper evaluation.',
    },
  ];

  for (const r of riskData) {
    await prisma.riskIndicator.create({
      data: {
        userId: user.id,
        type: r.type,
        level: r.level,
        explanation: r.explanation,
        disclaimer: r.disclaimer,
      },
    });
  }

  // 7. Create Prediction
  const predDate = new Date(today);
  predDate.setDate(predDate.getDate() + 2);

  await prisma.prediction.create({
    data: {
      userId: user.id,
      predictedDate: formatDate(predDate),
      confidence: 62,
      basedOn: 'Based on your personal average of 29 days, adjusted for current cycle length of 35 days and recent lifestyle factors.',
      estimatedWindowStart: formatDate(new Date(predDate.getTime() - 2 * 86400000)),
      estimatedWindowEnd: formatDate(new Date(predDate.getTime() + 2 * 86400000)),
    },
  });

  // 8. Create Reports
  await prisma.report.create({
    data: {
      userId: user.id,
      title: 'Monthly Health Summary — August 2026',
      type: 'monthly',
      summary: 'This month showed a significant deviation in cycle length. Lifestyle factors including sleep quality and stress levels had notable correlations with cycle irregularity.',
      dataJson: JSON.stringify({
        cycleCount: 1,
        averageCycleLength: 29,
        longestCycle: 35,
        shortestCycle: 28,
        commonSymptoms: [
          { type: 'fatigue', count: 8 },
          { type: 'cramps', count: 6 },
          { type: 'bloating', count: 4 },
          { type: 'headache', count: 3 },
          { type: 'mood-swings', count: 3 },
        ],
        lifestyleAverages: {
          sleep: 5.8,
          stress: 'moderate-high',
          hydration: 1.9,
          exercise: 28,
        },
      }),
    },
  });

  // 9. Create Chat Messages
  const messages = [
    { role: 'assistant', content: "Hello Sarah! 👋 I'm your RITORA health assistant. I've noticed some important changes in your cycle patterns. Would you like me to explain what I've found?" },
    { role: 'user', content: "Yes, I've been feeling really tired lately and my period seems late. What's going on?" },
    { role: 'assistant', content: "I can see why you're concerned. Here's what I've found:\n\n📊 **Cycle Status**: Your current cycle is at day 35, which is 6 days longer than your personal average of 29 days.\n\n😴 **Sleep Pattern**: You've been averaging about 5 hours of sleep this week — well below the recommended 7-9 hours.\n\n😰 **Stress Level**: Your stress has been consistently high to very-high over the past 5 days.\n\n💪 **Symptoms**: Fatigue (severity 4/5), heavy flow, and cramps are your most reported symptoms recently.\n\nThese factors are often interconnected. Elevated stress and poor sleep can delay ovulation, which extends your cycle. The fatigue may also be related to heavy flow — I've noted a moderate anemia-risk awareness indicator.\n\n⚠️ *Please note: These are awareness insights, not medical diagnoses. I'd recommend discussing these patterns with your healthcare provider.*" },
    { role: 'user', content: "What can I do to help get things back on track?" },
    { role: 'assistant', content: "Great question! Here are some personalized suggestions based on your data:\n\n🛌 **Sleep**: Aim for 7+ hours. Try setting a consistent bedtime and avoiding screens 1 hour before bed.\n\n🧘 **Stress Management**: Even 10 minutes of meditation or deep breathing can help. Your exercise days show better mood scores, so try to stay active.\n\n💧 **Hydration**: Increase to at least 2L per day. You're averaging 1.5L which is below optimal.\n\n🥗 **Nutrition**: With heavy flow and fatigue, focus on iron-rich foods like spinach, lentils, and lean red meat. Vitamin C helps iron absorption.\n\n🏃 **Exercise**: You've been doing 20 minutes recently — try to gradually increase to 30-45 minutes of moderate activity.\n\nI'll continue monitoring your patterns and let you know if anything changes. Would you like me to set up daily reminders for any of these?" },
  ];

  for (const m of messages) {
    await prisma.chatMessage.create({
      data: {
        userId: user.id,
        role: m.role,
        content: m.content,
      },
    });
  }

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
