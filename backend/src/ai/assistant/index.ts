import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../../config/env';
import { AIPipelineOutput, UserHealthSnapshot, RiskScreeningItem } from '../types';

/**
 * Assistant Engine Stub
 * To be implemented / enhanced by AI engineer: Context formatting, prompt template engineering, and Gemini LLM calls.
 */
export async function generateAIAssistantReply(
  snapshot: UserHealthSnapshot,
  pipelineOutput: AIPipelineOutput,
  userMessage: string
): Promise<string> {
  const { user } = snapshot;
  const { pattern, lifestyleAnalysis, riskScreening } = pipelineOutput;

  if (config.geminiApiKey) {
    try {
      const genAI = new GoogleGenerativeAI(config.geminiApiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `You are RITORA, an empathetic AI Menstrual Health Intelligence assistant.
User: ${user.name}
Cycle: Day ${pattern.currentCycleDay} (Baseline: ${user.averageCycleLength}d, Deviation: ${pattern.deviationDays >= 0 ? '+' : ''}${pattern.deviationDays}d)
Sleep: ${lifestyleAnalysis.avgSleep7Days}h/night
Risks: ${riskScreening.map((r: RiskScreeningItem) => r.type).join(', ') || 'None'}

Always provide supportive, non-diagnostic guidance with clinical awareness disclaimers.

User Question: ${userMessage}`;

      const res = await model.generateContent(prompt);
      return res.response.text();
    } catch (e) {
      console.warn('[Gemini Assistant Engine Fallback]', e);
    }
  }

  return `Hello ${user.name}! Your cycle is currently on Day ${pattern.currentCycleDay} (baseline: ${user.averageCycleLength} days). How can I assist you with your cycle or symptom trends today?`;
}
