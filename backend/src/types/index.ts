export type FlowLevel = 'spotting' | 'light' | 'medium' | 'heavy' | 'very-heavy';

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

export type StressLevel = 'low' | 'moderate' | 'high' | 'very-high';
export type MoodLevel = 'great' | 'good' | 'okay' | 'low' | 'bad';

export interface UserResponse {
  id: string;
  name: string;
  age: number;
  email: string;
  avatarUrl?: string;
  averageCycleLength: number;
  averagePeriodDuration: number;
  createdAt: string;
}

export interface CycleResponse {
  id: string;
  startDate: string;
  endDate: string | null;
  cycleLength: number | null;
  flow: FlowLevel[];
  symptoms: SymptomResponse[];
  isActive: boolean;
  periodDuration?: number;
  isRegular?: boolean;
  notes?: string;
}

export interface SymptomResponse {
  id: string;
  type: SymptomType;
  severity: 1 | 2 | 3 | 4 | 5;
  date: string;
  notes?: string;
}

export interface LifestyleResponse {
  id: string;
  date: string;
  sleep: number;
  stress: StressLevel;
  hydration: number;
  exercise: number;
  mood: MoodLevel;
  notes?: string;
}

export interface HealthInsightResponse {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'alert';
  category: 'pattern-change' | 'lifestyle-correlation' | 'symptom-trend' | 'cycle-prediction' | 'health-awareness';
  createdAt: string;
  icon?: string;
  actionableStep?: string;
}

export interface RiskIndicatorResponse {
  id: string;
  type: string;
  level: 'low' | 'moderate' | 'high';
  explanation: string;
  disclaimer: string;
}

export interface PredictionResponse {
  id: string;
  predictedDate: string;
  confidence: number;
  basedOn: string;
  estimatedWindowStart?: string;
  estimatedWindowEnd?: string;
}

export interface DashboardResponse {
  user: UserResponse;
  currentCycle: CycleResponse;
  prediction: PredictionResponse;
  insights: HealthInsightResponse[];
  riskIndicators: RiskIndicatorResponse[];
  recentSymptoms: SymptomResponse[];
  lifestyleOverview: LifestyleResponse[];
  cycleHistory: CycleResponse[];
}
