import { fetchUserHealthSnapshot } from './dataPreparation';
import { calculatePersonalBaseline } from './baseline';
import { predictCycleWindow } from './cycle-prediction';
import { detectCyclePatterns } from './cycle-pattern';
import { analyzeWhatChanged } from './what-changed';
import { analyzeSymptomPatterns } from './symptom-analysis';
import { analyzeLifestylePatterns } from './lifestyle-analysis';
import { screenHealthRisks } from './risk-screening';
import { buildExplainabilityEvidence } from './explainability';
import { generateHealthInsights } from './insight-generation';
import { generateRecommendations } from './recommendations';
import { evaluateSmartAlerts } from './alerts';
import { generateAIAssistantReply } from './assistant';
import { generateHealthSummaryReport } from './reports';
import { AIPipelineOutput, UserHealthSnapshot } from './types';

export * from './types';
export * from './dataPreparation';
export * from './baseline';
export * from './cycle-prediction';
export * from './cycle-pattern';
export * from './what-changed';
export * from './symptom-analysis';
export * from './lifestyle-analysis';
export * from './risk-screening';
export * from './explainability';
export * from './insight-generation';
export * from './recommendations';
export * from './alerts';
export * from './assistant';
export * from './reports';

/**
 * Pure Pipeline Evaluator
 * Runs all modular AI engines against a decoupled user health snapshot.
 */
export function evaluateUserHealthSnapshot(snapshot: UserHealthSnapshot): AIPipelineOutput {
  const baseline = calculatePersonalBaseline(snapshot.user, snapshot.cycles);
  const prediction = predictCycleWindow(snapshot.cycles, baseline);
  const pattern = detectCyclePatterns(snapshot.cycles, baseline);
  const whatChanged = analyzeWhatChanged(snapshot, baseline);
  const symptomAnalysis = analyzeSymptomPatterns(snapshot.symptoms, snapshot.cycles);
  const lifestyleAnalysis = analyzeLifestylePatterns(snapshot.lifestyle);
  const riskScreening = screenHealthRisks(snapshot, baseline, symptomAnalysis, lifestyleAnalysis, pattern);
  const evidence = buildExplainabilityEvidence(snapshot, baseline, pattern, whatChanged, symptomAnalysis, lifestyleAnalysis, riskScreening);
  const insights = generateHealthInsights(pattern, lifestyleAnalysis, evidence, whatChanged, riskScreening, baseline, symptomAnalysis);
  const recommendations = generateRecommendations(lifestyleAnalysis, pattern);
  const alerts = evaluateSmartAlerts(pattern, evidence);

  return {
    baseline,
    prediction,
    pattern,
    whatChanged,
    symptomAnalysis,
    lifestyleAnalysis,
    riskScreening,
    evidence,
    insights,
    recommendations,
    alerts,
  };
}

/**
 * Main Pipeline Orchestrator
 * Fetches user data via dataPreparation and executes the full AI analysis pipeline.
 */
export async function runAIPipeline(userId: string): Promise<AIPipelineOutput | null> {
  const snapshot = await fetchUserHealthSnapshot(userId);
  if (!snapshot) return null;
  return evaluateUserHealthSnapshot(snapshot);
}
