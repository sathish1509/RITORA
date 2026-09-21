export interface User {
  id: string;
  name: string;
  email: string;
  averageCycleLength: number;
  averagePeriodLength: number;
  lastPeriodStart: string;
}

export interface Cycle {
  id: string;
  userId: string;
  startDate: string;
  endDate?: string;
  cycleLength?: number;
  periodLength?: number;
  isRegular: boolean;
  notes?: string;
}

export type SymptomType =
  | 'cramps'
  | 'headache'
  | 'bloating'
  | 'fatigue'
  | 'mood-swings'
  | 'breast-tenderness'
  | 'acne'
  | 'nausea'
  | 'back-pain'
  | 'insomnia'
  | 'anxiety'
  | 'cravings';

export interface Symptom {
  id: string;
  userId: string;
  date: string;
  type: SymptomType;
  severity: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

export type FlowLevel = 'spotting' | 'light' | 'medium' | 'heavy' | 'very-heavy';

export interface FlowEntry {
  id: string;
  userId: string;
  date: string;
  level: FlowLevel;
}

export interface LifestyleEntry {
  id: string;
  userId: string;
  date: string;
  sleepHours: number;
  stressLevel: 'low' | 'moderate' | 'high' | 'very-high';
  hydrationLiters: number;
  exerciseMinutes: number;
  mood: 'great' | 'good' | 'neutral' | 'low' | 'irritable';
}

export interface HealthInsight {
  id: string;
  userId: string;
  date: string;
  title: string;
  type: 'pattern' | 'anomaly' | 'correlation' | 'tip';
  description: string;
  severity: 'info' | 'warning' | 'alert';
  actionableStep?: string;
}

export interface RiskIndicator {
  id: string;
  userId: string;
  type: string;
  level: 'low' | 'moderate' | 'high';
  explanation: string;
  disclaimer: string;
}

export interface Prediction {
  predictedDate: string;
  confidence: number;
  estimatedWindowStart: string;
  estimatedWindowEnd: string;
}
