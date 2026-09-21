// ============================================================
// RITORA — Shared Frontend Data Model
// ============================================================
// These types define the contract between frontend and backend.
// When the backend is ready, API responses should match these types.
// ============================================================

export interface User {
  id: string;
  name: string;
  age: number;
  email: string;
  avatarUrl?: string;
  averageCycleLength: number;
  averagePeriodDuration: number;
  createdAt: string;
}

export interface Cycle {
  id: string;
  startDate: string;
  endDate: string | null;
  cycleLength: number | null;
  flow: FlowLevel[];
  symptoms: Symptom[];
  isActive: boolean;
}

export type FlowLevel = 'spotting' | 'light' | 'medium' | 'heavy' | 'very-heavy';

export interface Symptom {
  id: string;
  type: SymptomType;
  severity: 1 | 2 | 3 | 4 | 5;
  date: string;
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

export interface LifestyleEntry {
  id: string;
  date: string;
  sleep: number; // hours
  stress: StressLevel;
  hydration: number; // liters
  exercise: number; // minutes
  mood: MoodLevel;
  notes?: string;
}

export type StressLevel = 'low' | 'moderate' | 'high' | 'very-high';
export type MoodLevel = 'great' | 'good' | 'okay' | 'low' | 'bad';

export interface HealthInsight {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'alert';
  category: InsightCategory;
  createdAt: string;
  icon?: string;
}

export type InsightCategory =
  | 'pattern-change'
  | 'lifestyle-correlation'
  | 'symptom-trend'
  | 'cycle-prediction'
  | 'health-awareness';

export interface RiskIndicator {
  id: string;
  type: string;
  level: 'low' | 'moderate' | 'high';
  explanation: string;
  disclaimer: string;
}

export interface Prediction {
  id: string;
  predictedDate: string;
  confidence: number; // 0-100
  basedOn: string;
}

export interface Report {
  id: string;
  title: string;
  type: 'monthly' | 'quarterly' | 'annual' | 'custom';
  generatedAt: string;
  summary: string;
  data: ReportData;
}

export interface ReportData {
  cycleCount: number;
  averageCycleLength: number;
  longestCycle: number;
  shortestCycle: number;
  commonSymptoms: { type: SymptomType; count: number }[];
  lifestyleAverages: {
    sleep: number;
    stress: string;
    hydration: number;
    exercise: number;
  };
}

export interface DashboardData {
  user: User;
  currentCycle: Cycle;
  prediction: Prediction;
  insights: HealthInsight[];
  riskIndicators: RiskIndicator[];
  recentSymptoms: Symptom[];
  lifestyleOverview: LifestyleEntry[];
  cycleHistory: Cycle[];
}

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
