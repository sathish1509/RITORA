import { fetchUserHealthSnapshot, evaluateUserHealthSnapshot, generateAIAssistantReply } from '../ai';
import { prisma } from '../config/db';

/**
 * Service bridge for AI Assistant interactions.
 * Fetches user health snapshot, executes full AI pipeline, and generates
 * data-grounded responses via Gemini or deterministic fallback.
 */
export async function generateAssistantResponse(userId: string, userMessage: string): Promise<string> {
  const snapshot = await fetchUserHealthSnapshot(userId);

  if (!snapshot) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const userName = user?.name || 'there';
    return `Hello ${userName}! I'm RITORA, your Menstrual Health Intelligence assistant. Feel free to log your cycle, symptoms, or lifestyle factors so I can provide personalized health observations!`;
  }

  const pipelineOutput = evaluateUserHealthSnapshot(snapshot);
  return generateAIAssistantReply(snapshot, pipelineOutput, userMessage);
}
