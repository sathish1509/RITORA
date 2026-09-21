import {
  User,
  Cycle,
  Symptom,
  LifestyleEntry,
  HealthInsight,
  RiskIndicator,
  Prediction,
} from '../types';

export const mockUser: User = {
  id: 'usr_01',
  name: 'Sarah',
  email: 'sarah@example.com',
  averageCycleLength: 29,
  averagePeriodLength: 5,
  lastPeriodStart: '2026-02-15',
};

export const currentCycleDay = 35;

export const mockCycles: Cycle[] = [
  {
    id: 'cyc_04',
    userId: 'usr_01',
    startDate: '2026-02-15',
    isRegular: false,
    notes: 'Current active cycle — delayed by 6 days so far',
  },
  {
    id: 'cyc_03',
    userId: 'usr_01',
    startDate: '2026-01-17',
    endDate: '2026-02-14',
    cycleLength: 29,
    periodLength: 5,
    isRegular: true,
  },
  {
    id: 'cyc_02',
    userId: 'usr_01',
    startDate: '2025-12-19',
    endDate: '2026-01-16',
    cycleLength: 29,
    periodLength: 5,
    isRegular: true,
  },
  {
    id: 'cyc_01',
    userId: 'usr_01',
    startDate: '2025-11-20',
    endDate: '2025-12-18',
    cycleLength: 28,
    periodLength: 4,
    isRegular: true,
  },
];

export const mockSymptoms: Symptom[] = [
  { id: 'sym_01', userId: 'usr_01', date: '2026-03-20', type: 'cramps', severity: 4 },
  { id: 'sym_02', userId: 'usr_01', date: '2026-03-20', type: 'fatigue', severity: 5 },
  { id: 'sym_03', userId: 'usr_01', date: '2026-03-19', type: 'mood-swings', severity: 3 },
  { id: 'sym_04', userId: 'usr_01', date: '2026-03-18', type: 'bloating', severity: 4 },
  { id: 'sym_05', userId: 'usr_01', date: '2026-03-17', type: 'headache', severity: 2 },
];

export const mockLifestyle: LifestyleEntry[] = [
  {
    id: 'life_01',
    userId: 'usr_01',
    date: '2026-03-21',
    sleepHours: 5,
    stressLevel: 'high',
    hydrationLiters: 1.2,
    exerciseMinutes: 0,
    mood: 'low',
  },
  {
    id: 'life_02',
    userId: 'usr_01',
    date: '2026-03-20',
    sleepHours: 5.5,
    stressLevel: 'high',
    hydrationLiters: 1.5,
    exerciseMinutes: 15,
    mood: 'irritable',
  },
];

export const mockInsights: HealthInsight[] = [
  {
    id: 'ins_01',
    userId: 'usr_01',
    date: '2026-03-21',
    title: 'Pattern Change Detected',
    type: 'anomaly',
    description:
      'Your current cycle is at Day 35, exceeding your personal average of 29 days by 6 days. Logged data shows high stress levels (rating 4/5) and reduced sleep averaging 5.2 hours over the last 10 days, which correlates strongly with cycle variation.',
    severity: 'warning',
    actionableStep: 'Consider reducing evening screen time and practicing 10-minute mindfulness breathing before sleep.',
  },
];

export const mockRiskIndicators: RiskIndicator[] = [
  {
    id: 'risk_01',
    userId: 'usr_01',
    type: 'Heavy Flow & Fatigue Correlation',
    level: 'moderate',
    explanation:
      'Consecutive logs of heavy menstrual flow combined with high fatigue ratings over 3 cycles may indicate iron depletion or mild anemia risk. Monitoring ferritin levels with a healthcare provider is suggested.',
    disclaimer: 'This is an awareness indicator, not a medical diagnosis.',
  },
];

export const mockPredictions: Prediction[] = [
  {
    predictedDate: '2026-03-24',
    confidence: 78,
    estimatedWindowStart: '2026-03-22',
    estimatedWindowEnd: '2026-03-26',
  },
];
