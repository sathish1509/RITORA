import type {
  User,
  Cycle,
  Symptom,
  LifestyleEntry,
  HealthInsight,
  RiskIndicator,
  Prediction,
  Report,
  DashboardData,
  AssistantMessage,
} from '../types';

// ============================================================
// Demo User: Sarah
// ============================================================
export const mockUser: User = {
  id: 'usr_001',
  name: 'Sarah',
  age: 24,
  email: 'sarah@ritora.app',
  avatarUrl: undefined,
  averageCycleLength: 29,
  averagePeriodDuration: 5,
  createdAt: '2025-06-15T10:00:00Z',
};

// ============================================================
// Cycle History
// ============================================================
const today = new Date();
const formatDate = (d: Date) => d.toISOString().split('T')[0];

function daysAgo(days: number): string {
  const d = new Date(today);
  d.setDate(d.getDate() - days);
  return formatDate(d);
}

export const mockCycles: Cycle[] = [
  {
    id: 'cyc_005',
    startDate: daysAgo(34),
    endDate: null,
    cycleLength: null,
    flow: ['medium', 'heavy', 'heavy', 'medium', 'light'],
    symptoms: [],
    isActive: true,
  },
  {
    id: 'cyc_004',
    startDate: daysAgo(34 + 29),
    endDate: daysAgo(34 + 29 - 5),
    cycleLength: 29,
    flow: ['light', 'medium', 'medium', 'light', 'spotting'],
    symptoms: [],
    isActive: false,
  },
  {
    id: 'cyc_003',
    startDate: daysAgo(34 + 29 + 30),
    endDate: daysAgo(34 + 29 + 30 - 5),
    cycleLength: 30,
    flow: ['medium', 'medium', 'heavy', 'medium', 'light'],
    symptoms: [],
    isActive: false,
  },
  {
    id: 'cyc_002',
    startDate: daysAgo(34 + 29 + 30 + 29),
    endDate: daysAgo(34 + 29 + 30 + 29 - 5),
    cycleLength: 29,
    flow: ['light', 'medium', 'medium', 'light', 'spotting'],
    symptoms: [],
    isActive: false,
  },
  {
    id: 'cyc_001',
    startDate: daysAgo(34 + 29 + 30 + 29 + 28),
    endDate: daysAgo(34 + 29 + 30 + 29 + 28 - 5),
    cycleLength: 28,
    flow: ['medium', 'heavy', 'medium', 'light', 'spotting'],
    symptoms: [],
    isActive: false,
  },
];

// Current cycle is 35 days old
export const currentCycle = mockCycles[0];
export const currentCycleDay = 35;

// ============================================================
// Symptoms
// ============================================================
export const mockSymptoms: Symptom[] = [
  { id: 'sym_001', type: 'fatigue', severity: 4, date: daysAgo(0) },
  { id: 'sym_002', type: 'cramps', severity: 3, date: daysAgo(0) },
  { id: 'sym_003', type: 'fatigue', severity: 4, date: daysAgo(1) },
  { id: 'sym_004', type: 'cramps', severity: 4, date: daysAgo(1) },
  { id: 'sym_005', type: 'bloating', severity: 2, date: daysAgo(1) },
  { id: 'sym_006', type: 'fatigue', severity: 3, date: daysAgo(2) },
  { id: 'sym_007', type: 'headache', severity: 2, date: daysAgo(2) },
  { id: 'sym_008', type: 'mood-swings', severity: 3, date: daysAgo(3) },
  { id: 'sym_009', type: 'cramps', severity: 2, date: daysAgo(3) },
  { id: 'sym_010', type: 'back-pain', severity: 3, date: daysAgo(4) },
  { id: 'sym_011', type: 'insomnia', severity: 3, date: daysAgo(5) },
  { id: 'sym_012', type: 'breast-tenderness', severity: 2, date: daysAgo(6) },
  { id: 'sym_013', type: 'anxiety', severity: 2, date: daysAgo(7) },
  { id: 'sym_014', type: 'cravings', severity: 3, date: daysAgo(8) },
  { id: 'sym_015', type: 'acne', severity: 2, date: daysAgo(10) },
];

// ============================================================
// Lifestyle Entries
// ============================================================
export const mockLifestyle: LifestyleEntry[] = [
  { id: 'lf_001', date: daysAgo(0), sleep: 5, stress: 'high', hydration: 1.5, exercise: 20, mood: 'low' },
  { id: 'lf_002', date: daysAgo(1), sleep: 5.5, stress: 'high', hydration: 1.2, exercise: 0, mood: 'low' },
  { id: 'lf_003', date: daysAgo(2), sleep: 4.5, stress: 'very-high', hydration: 1.8, exercise: 15, mood: 'bad' },
  { id: 'lf_004', date: daysAgo(3), sleep: 6, stress: 'high', hydration: 2.0, exercise: 30, mood: 'okay' },
  { id: 'lf_005', date: daysAgo(4), sleep: 5, stress: 'moderate', hydration: 1.5, exercise: 25, mood: 'okay' },
  { id: 'lf_006', date: daysAgo(5), sleep: 6.5, stress: 'moderate', hydration: 2.2, exercise: 40, mood: 'good' },
  { id: 'lf_007', date: daysAgo(6), sleep: 7, stress: 'low', hydration: 2.5, exercise: 45, mood: 'great' },
  { id: 'lf_008', date: daysAgo(7), sleep: 6, stress: 'moderate', hydration: 2.0, exercise: 30, mood: 'good' },
  { id: 'lf_009', date: daysAgo(8), sleep: 5.5, stress: 'high', hydration: 1.8, exercise: 15, mood: 'okay' },
  { id: 'lf_010', date: daysAgo(9), sleep: 7.5, stress: 'low', hydration: 2.5, exercise: 50, mood: 'great' },
  { id: 'lf_011', date: daysAgo(10), sleep: 6, stress: 'moderate', hydration: 2.0, exercise: 35, mood: 'good' },
  { id: 'lf_012', date: daysAgo(11), sleep: 5, stress: 'high', hydration: 1.5, exercise: 10, mood: 'low' },
  { id: 'lf_013', date: daysAgo(12), sleep: 6.5, stress: 'moderate', hydration: 2.3, exercise: 40, mood: 'good' },
  { id: 'lf_014', date: daysAgo(13), sleep: 7, stress: 'low', hydration: 2.5, exercise: 45, mood: 'great' },
];

// ============================================================
// Health Insights
// ============================================================
export const mockInsights: HealthInsight[] = [
  {
    id: 'ins_001',
    title: 'Pattern Change Detected',
    description:
      'Your current cycle is at day 35, which is 6 days longer than your personal average of 29 days. Recent changes in sleep, stress, and symptoms are also visible in your recent records. This could be related to your elevated stress levels and reduced sleep over the past week.',
    severity: 'warning',
    category: 'pattern-change',
    createdAt: daysAgo(0),
    icon: 'alert-triangle',
  },
  {
    id: 'ins_002',
    title: 'Sleep & Cycle Correlation',
    description:
      'Your average sleep over the last 7 days is 5.5 hours, which is below the recommended 7-9 hours. Research shows that sleep deprivation can affect menstrual cycle regularity. Consider improving your sleep hygiene to support cycle health.',
    severity: 'info',
    category: 'lifestyle-correlation',
    createdAt: daysAgo(1),
    icon: 'moon',
  },
  {
    id: 'ins_003',
    title: 'Stress Impact Analysis',
    description:
      'Your stress levels have been elevated (high to very-high) for 5 of the last 7 days. Chronic stress is associated with delayed ovulation and longer cycles. The current cycle extension may be partially attributed to this pattern.',
    severity: 'warning',
    category: 'lifestyle-correlation',
    createdAt: daysAgo(1),
    icon: 'brain',
  },
  {
    id: 'ins_004',
    title: 'Symptom Trend: Fatigue Increasing',
    description:
      'Fatigue has been reported with increasing severity over the past 3 days (severity 3 → 4 → 4). Combined with heavy flow and low sleep, this may indicate your body needs more rest and iron-rich nutrition.',
    severity: 'info',
    category: 'symptom-trend',
    createdAt: daysAgo(0),
    icon: 'battery-low',
  },
  {
    id: 'ins_005',
    title: 'Hydration Below Target',
    description:
      'Your average water intake is 1.5L per day this week, below the recommended 2L minimum. Adequate hydration can help reduce bloating and improve overall cycle comfort.',
    severity: 'info',
    category: 'lifestyle-correlation',
    createdAt: daysAgo(2),
    icon: 'droplets',
  },
];

// ============================================================
// Risk Indicators
// ============================================================
export const mockRiskIndicators: RiskIndicator[] = [
  {
    id: 'risk_001',
    type: 'Anemia Risk',
    level: 'moderate',
    explanation:
      'Based on your reported heavy flow, fatigue, and reduced iron-rich food intake, there is a moderate awareness level for potential iron-deficiency anemia. Heavy menstrual bleeding is one of the most common causes of iron deficiency in premenopausal women.',
    disclaimer: 'This is an awareness indicator, not a medical diagnosis. Please consult a healthcare provider for proper evaluation.',
  },
  {
    id: 'risk_002',
    type: 'Stress-Related Cycle Disruption',
    level: 'moderate',
    explanation:
      'Prolonged high stress levels can affect your hypothalamic-pituitary-ovarian axis, potentially delaying ovulation and extending your cycle. Your current +6 day deviation aligns with your elevated stress pattern.',
    disclaimer: 'This is an awareness indicator, not a medical diagnosis. Please consult a healthcare provider for proper evaluation.',
  },
];

// ============================================================
// Predictions
// ============================================================
export const mockPredictions: Prediction[] = [
  {
    id: 'pred_001',
    predictedDate: (() => {
      const d = new Date(today);
      d.setDate(d.getDate() + 2);
      return formatDate(d);
    })(),
    confidence: 62,
    basedOn: 'Based on your personal average of 29 days, adjusted for current cycle length of 35 days and recent lifestyle factors.',
  },
];

// ============================================================
// Reports
// ============================================================
export const mockReports: Report[] = [
  {
    id: 'rpt_001',
    title: 'Monthly Health Summary — August 2026',
    type: 'monthly',
    generatedAt: daysAgo(5),
    summary:
      'This month showed a significant deviation in cycle length. Lifestyle factors including sleep quality and stress levels had notable correlations with cycle irregularity.',
    data: {
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
    },
  },
  {
    id: 'rpt_002',
    title: 'Quarterly Wellness Report — Q2 2026',
    type: 'quarterly',
    generatedAt: daysAgo(30),
    summary:
      'Over the past 3 months, your cycle regularity has been good with an average of 29 days. Sleep and exercise patterns show room for improvement.',
    data: {
      cycleCount: 3,
      averageCycleLength: 29,
      longestCycle: 30,
      shortestCycle: 28,
      commonSymptoms: [
        { type: 'cramps', count: 15 },
        { type: 'fatigue', count: 12 },
        { type: 'bloating', count: 8 },
        { type: 'mood-swings', count: 7 },
        { type: 'headache', count: 5 },
      ],
      lifestyleAverages: {
        sleep: 6.2,
        stress: 'moderate',
        hydration: 2.1,
        exercise: 32,
      },
    },
  },
];

// ============================================================
// Assistant Messages (Demo Conversation)
// ============================================================
export const mockAssistantMessages: AssistantMessage[] = [
  {
    id: 'msg_001',
    role: 'assistant',
    content:
      "Hello Sarah! 👋 I'm your RITORA health assistant. I've noticed some important changes in your cycle patterns. Would you like me to explain what I've found?",
    timestamp: daysAgo(0) + 'T09:00:00Z',
  },
  {
    id: 'msg_002',
    role: 'user',
    content: "Yes, I've been feeling really tired lately and my period seems late. What's going on?",
    timestamp: daysAgo(0) + 'T09:01:00Z',
  },
  {
    id: 'msg_003',
    role: 'assistant',
    content:
      "I can see why you're concerned. Here's what I've found:\n\n📊 **Cycle Status**: Your current cycle is at day 35, which is 6 days longer than your personal average of 29 days.\n\n😴 **Sleep Pattern**: You've been averaging about 5 hours of sleep this week — well below the recommended 7-9 hours.\n\n😰 **Stress Level**: Your stress has been consistently high to very-high over the past 5 days.\n\n💪 **Symptoms**: Fatigue (severity 4/5), heavy flow, and cramps are your most reported symptoms recently.\n\nThese factors are often interconnected. Elevated stress and poor sleep can delay ovulation, which extends your cycle. The fatigue may also be related to heavy flow — I've noted a moderate anemia-risk awareness indicator.\n\n⚠️ *Please note: These are awareness insights, not medical diagnoses. I'd recommend discussing these patterns with your healthcare provider.*",
    timestamp: daysAgo(0) + 'T09:02:00Z',
  },
  {
    id: 'msg_004',
    role: 'user',
    content: 'What can I do to help get things back on track?',
    timestamp: daysAgo(0) + 'T09:03:00Z',
  },
  {
    id: 'msg_005',
    role: 'assistant',
    content:
      "Great question! Here are some personalized suggestions based on your data:\n\n🛌 **Sleep**: Aim for 7+ hours. Try setting a consistent bedtime and avoiding screens 1 hour before bed.\n\n🧘 **Stress Management**: Even 10 minutes of meditation or deep breathing can help. Your exercise days show better mood scores, so try to stay active.\n\n💧 **Hydration**: Increase to at least 2L per day. You're averaging 1.5L which is below optimal.\n\n🥗 **Nutrition**: With heavy flow and fatigue, focus on iron-rich foods like spinach, lentils, and lean red meat. Vitamin C helps iron absorption.\n\n🏃 **Exercise**: You've been doing 20 minutes recently — try to gradually increase to 30-45 minutes of moderate activity.\n\nI'll continue monitoring your patterns and let you know if anything changes. Would you like me to set up daily reminders for any of these?",
    timestamp: daysAgo(0) + 'T09:04:00Z',
  },
];

// ============================================================
// Chart Data for Cycle Trends
// ============================================================
export const cycleTrendData = [
  { cycle: 'Cycle 1', length: 28, average: 29 },
  { cycle: 'Cycle 2', length: 29, average: 29 },
  { cycle: 'Cycle 3', length: 30, average: 29 },
  { cycle: 'Cycle 4', length: 29, average: 29 },
  { cycle: 'Current', length: 35, average: 29 },
];

export const lifestyleChartData = mockLifestyle.slice(0, 7).reverse().map((entry) => ({
  date: new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' }),
  sleep: entry.sleep,
  hydration: entry.hydration,
  exercise: entry.exercise / 10,
  stress: entry.stress === 'low' ? 1 : entry.stress === 'moderate' ? 2 : entry.stress === 'high' ? 3 : 4,
}));

// ============================================================
// Dashboard Data
// ============================================================
export const mockDashboardData: DashboardData = {
  user: mockUser,
  currentCycle: currentCycle,
  prediction: mockPredictions[0],
  insights: mockInsights,
  riskIndicators: mockRiskIndicators,
  recentSymptoms: mockSymptoms.slice(0, 5),
  lifestyleOverview: mockLifestyle.slice(0, 7),
  cycleHistory: mockCycles,
};
