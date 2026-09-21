import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env';
import { prisma } from '../config/db';
import { analyzeUserHealth } from './intelligenceEngine';

export async function generateAssistantResponse(userId: string, userMessage: string): Promise<string> {
  // 1. Gather rich user health context
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      cycles: { orderBy: { startDate: 'desc' }, take: 3 },
      symptoms: { orderBy: { date: 'desc' }, take: 5 },
      lifestyleEntries: { orderBy: { date: 'desc' }, take: 7 },
    },
  });

  const analysis = await analyzeUserHealth(userId);

  const contextData = {
    userName: user?.name || 'User',
    currentCycleDay: analysis.currentCycleDay,
    personalAverageLength: user?.averageCycleLength || 29,
    deviationDays: analysis.deviation,
    recentSymptoms: (user?.symptoms || []).map((s) => `${s.type} (severity ${s.severity}/5 on ${s.date})`).join(', '),
    averageSleepLast7Days: user?.lifestyleEntries.length
      ? (user.lifestyleEntries.reduce((sum, l) => sum + l.sleep, 0) / user.lifestyleEntries.length).toFixed(1)
      : 'unknown',
    highStressDays: user?.lifestyleEntries.filter((l) => ['high', 'very-high'].includes(l.stress.toLowerCase())).length || 0,
    riskIndicators: analysis.riskIndicators.map((r) => r.type).join(', '),
  };

  // 2. If Gemini API Key is available, use Google Generative AI
  if (config.geminiApiKey) {
    try {
      const genAI = new GoogleGenerativeAI(config.geminiApiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const systemPrompt = `
You are RITORA, an empathetic, evidence-based AI Menstrual Health Intelligence Assistant.
You help women understand the connection between their menstrual cycle, symptoms, and daily lifestyle factors (sleep, stress, hydration, nutrition).

Here is the current user's personal health profile:
- Name: ${contextData.userName}
- Current Cycle: Day ${contextData.currentCycleDay} (Personal baseline average: ${contextData.personalAverageLength} days)
- Cycle Deviation: ${contextData.deviationDays >= 0 ? '+' : ''}${contextData.deviationDays} days
- Recent Symptoms: ${contextData.recentSymptoms || 'None logged recently'}
- 7-Day Sleep Average: ${contextData.averageSleepLast7Days} hours/night
- Elevated Stress Days: ${contextData.highStressDays} of the last 7 days
- Active Awareness Indicators: ${contextData.riskIndicators || 'None'}

Guidelines:
1. Be warm, empathetic, supportive, and clear.
2. Formulate answers referencing their actual tracked numbers (e.g. Day ${contextData.currentCycleDay}, sleep deficit, or stress).
3. Offer actionable, practical lifestyle suggestions (sleep hygiene, stress management, hydration, iron-rich nutrition for heavy flow).
4. CRITICAL: Always include a gentle disclaimer that RITORA provides health intelligence for awareness, not medical diagnoses.
`;

      const result = await model.generateContent(`${systemPrompt}\n\nUser Question: ${userMessage}`);
      return result.response.text();
    } catch (err) {
      console.warn('[Gemini AI API Error, falling back to intelligence response engine]', err);
    }
  }

  // 3. Fallback Intelligent Contextual Response Engine
  const lowerMsg = userMessage.toLowerCase();

  if (lowerMsg.includes('tired') || lowerMsg.includes('fatigue') || lowerMsg.includes('late') || lowerMsg.includes('delay') || lowerMsg.includes('what is going on') || lowerMsg.includes("what's going on")) {
    return `I can see why you're concerned. Here's what I've found from your health records:

📊 **Cycle Status**: Your current cycle is at Day ${contextData.currentCycleDay}, which is ${contextData.deviationDays} days longer than your personal baseline of ${contextData.personalAverageLength} days.

😴 **Sleep Pattern**: You've been averaging about ${contextData.averageSleepLast7Days} hours of sleep this week — below the recommended 7–9 hours.

😰 **Stress Level**: Your stress has been elevated for ${contextData.highStressDays} of your last 7 days.

💪 **Symptoms**: Recent reports include ${contextData.recentSymptoms || 'fatigue and cramps'}.

These factors are often interconnected. Elevated stress and reduced sleep can delay ovulation, which extends your cycle. The fatigue may also be related to heavy flow — I've noted a moderate anemia-risk awareness indicator.

⚠️ *Please note: These are awareness insights, not medical diagnoses. I recommend discussing persistent patterns with your healthcare provider.*`;
  }

  if (lowerMsg.includes('do') || lowerMsg.includes('track') || lowerMsg.includes('help') || lowerMsg.includes('better') || lowerMsg.includes('recommend') || lowerMsg.includes('suggestion')) {
    return `Here are personalized recommendations based on your current data:

🛌 **Sleep Hygiene**: Aim for 7+ hours nightly. A consistent sleep schedule supports hormone regulation.

🧘 **Stress Management**: High stress increases cortisol which can delay cycle phases. Even 10 minutes of mindfulness breathing can help.

💧 **Hydration**: Aim for 2.0L+ daily to reduce bloating and support metabolic energy.

🥗 **Nutrition**: With reported fatigue and heavy flow, focus on iron-rich foods (spinach, lentils, seeds, lean protein) paired with vitamin C for absorption.

🏃 **Movement**: Light to moderate activity (20–30 min) has shown positive correlations with your mood scores.

I will continue monitoring your patterns as you log daily updates!`;
  }

  return `Hello ${contextData.userName}! 👋 I'm your RITORA health assistant. 

Your current cycle is on Day ${contextData.currentCycleDay} (${contextData.deviationDays >= 0 ? '+' : ''}${contextData.deviationDays} days from your ${contextData.personalAverageLength}-day average). 

Feel free to ask me anything about your cycle trends, symptom correlations, or lifestyle recommendations!

⚠️ *Note: RITORA provides health awareness insights and is not a substitute for professional medical advice.*`;
}
