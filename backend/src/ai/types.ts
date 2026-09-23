// Domain Data Transfer Objects (DTOs)
export interface CycleRecord {
  id: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string | null;
  cycleLength?: number | null;
  periodDuration?: number | null;
  flow?: 'LIGHT' | 'MEDIUM' | 'HEAVY' | string | null;
  isActive?: boolean;
}

export interface SymptomRecord {
  id: string;
  type: string;
  severity: number; // 1-5
  date: string; // YYYY-MM-DD
  notes?: string | null;
}

export interface LifestyleRecord {
  id: string;
  date: string; // YYYY-MM-DD
  sleep: number; // hours
  stress: 'low' | 'medium' | 'high' | 'very-high' | string;
  hydration: number; // liters
  exercise: number; // minutes
  mood: string;
}

export interface UserProfileSnapshot {
  id: string;
  name: string;
  averageCycleLength: number;
  averagePeriodDuration: number;
}

export interface UserHealthSnapshot {
  user: UserProfileSnapshot;
  cycles: CycleRecord[];
  symptoms: SymptomRecord[];
  lifestyle: LifestyleRecord[];
}

// Evidence Contracts
export interface EvidenceContract {
  metric: string;
  baselineValue: number | string;
  currentValue: number | string;
  difference: number | string;
  unit: string;
  significance: 'NORMAL' | 'NOTICEABLE' | 'SIGNIFICANT';
  explanation: string;
}

// Sub-engine Output Contracts
export interface BaselineResult {
  meanCycleLength: number;
  medianCycleLength: number;
  cycleLengthStdDev: number;
  meanPeriodDuration: number;
  confidenceScore: number; // 0-100
  sampleSize: number;
}

export interface PredictionResult {
  predictedStartDate: string;
  estimatedWindowStart: string;
  estimatedWindowEnd: string;
  confidence: number; // 0-100
  basedOn: string;
}

export type CyclePhase = 'MENSTRUAL' | 'FOLLICULAR' | 'OVULATION' | 'LUTEAL';

export interface PatternResult {
  currentCycleDay: number;
  deviationDays: number;
  isDelayed: boolean;
  isEarly: boolean;
  status: 'REGULAR' | 'DELAYED' | 'EARLY' | 'IRREGULAR';
  summary: string;
  phase?: CyclePhase;
  phaseDescription?: string;
  isVariabilityHigh?: boolean;
}

export interface WhatChangedMetric {
  category: 'CYCLE' | 'SLEEP' | 'STRESS' | 'HYDRATION' | 'SYMPTOMS';
  metricName: string;
  baseline: string | number;
  recent: string | number;
  delta: string | number;
  direction: 'UP' | 'DOWN' | 'STABLE';
  significance?: 'NORMAL' | 'NOTICEABLE' | 'SIGNIFICANT';
  description?: string;
}

export interface WhatChangedResult {
  hasSignificantChanges: boolean;
  changes: WhatChangedMetric[];
  summary?: string;
}

export interface SymptomTrendItem {
  symptomType: string;
  frequency: number;
  averageSeverity: number;
  isIncreasing: boolean;
  occurrences?: number;
  cyclesAnalyzed?: number;
  pattern?: 'recurring' | 'occasional' | 'isolated';
  trendDescription?: string;
}

export interface SymptomAnalysisResult {
  topSymptoms: SymptomTrendItem[];
  highSeveritySymptoms: SymptomTrendItem[];
  recurringSymptoms?: SymptomTrendItem[];
}

export interface LifestyleAnalysisResult {
  avgSleep7Days: number;
  sleepDeficit: boolean;
  highStressDaysCount: number;
  isElevatedStress: boolean;
  avgHydration7Days: number;
  hydrationBelowTarget: boolean;
  historicalAvgSleep?: number;
  sleepDelta?: number;
  historicalAvgHydration?: number;
  hydrationDelta?: number;
  historicalHighStressDays?: number;
  stressDeltaDays?: number;
}


export interface RiskScreeningItem {
  id: string;
  type: string;
  level: 'low' | 'moderate' | 'high';
  explanation: string;
  disclaimer: string;
  contributingFactors?: string[];
  suggestedAction?: string;
}

export interface RecommendationItem {
  id: string;
  category: 'SLEEP' | 'STRESS' | 'HYDRATION' | 'NUTRITION' | 'MOVEMENT';
  title: string;
  suggestion: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface AlertItem {
  id: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  title: string;
  message: string;
  evidence: EvidenceContract[];
  createdAt: string;
}

export interface HealthInsightItem {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'alert';
  category: 'health-awareness' | 'pattern-change' | 'lifestyle-correlation' | 'symptom-trend';
  icon: string;
  actionableStep?: string;
  evidence?: EvidenceContract[];
  createdAt: string;
  isPrimary?: boolean;
  contributingFactors?: string[];
}

export interface AIPipelineOutput {
  baseline: BaselineResult;
  prediction: PredictionResult;
  pattern: PatternResult;
  whatChanged: WhatChangedResult;
  symptomAnalysis: SymptomAnalysisResult;
  lifestyleAnalysis: LifestyleAnalysisResult;
  riskScreening: RiskScreeningItem[];
  evidence: EvidenceContract[];
  insights: HealthInsightItem[];
  recommendations: RecommendationItem[];
  alerts: AlertItem[];
}
