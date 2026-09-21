import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { analyzeUserHealth } from '../services/intelligenceEngine';
import { predictNextPeriod } from '../services/predictionEngine';

function parseFlow(flowStr: string | null): string[] {
  if (!flowStr) return [];
  try {
    return JSON.parse(flowStr);
  } catch {
    return [];
  }
}

export async function getInsights(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const analysis = await analyzeUserHealth(userId);
  res.json(analysis.insights);
}

export async function getRisks(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const analysis = await analyzeUserHealth(userId);
  res.json(analysis.riskIndicators);
}

export async function getPredictions(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const predictions = await predictNextPeriod(userId);
  res.json(predictions);
}

export async function getDashboard(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      cycles: {
        orderBy: { startDate: 'desc' },
        include: { symptoms: true },
      },
      symptoms: {
        orderBy: { date: 'desc' },
        take: 5,
      },
      lifestyleEntries: {
        orderBy: { date: 'desc' },
        take: 7,
      },
    },
  });

  if (!user) throw new AppError('User not found', 404);

  const [analysis, predictions] = await Promise.all([
    analyzeUserHealth(userId),
    predictNextPeriod(userId),
  ]);

  const activeCycle = user.cycles.find((c) => c.isActive) || user.cycles[0];

  const currentCycleFormatted = activeCycle
    ? {
        id: activeCycle.id,
        startDate: activeCycle.startDate,
        endDate: activeCycle.endDate,
        cycleLength: activeCycle.cycleLength,
        periodDuration: activeCycle.periodDuration || 5,
        flow: parseFlow(activeCycle.flow),
        symptoms: (activeCycle.symptoms || []).map((s) => ({
          id: s.id,
          type: s.type,
          severity: s.severity,
          date: s.date,
          notes: s.notes || undefined,
        })),
        isActive: activeCycle.isActive,
        isRegular: activeCycle.isRegular,
        notes: activeCycle.notes || undefined,
      }
    : null;

  const cycleHistoryFormatted = user.cycles.map((c) => ({
    id: c.id,
    startDate: c.startDate,
    endDate: c.endDate,
    cycleLength: c.cycleLength,
    periodDuration: c.periodDuration || 5,
    flow: parseFlow(c.flow),
    symptoms: (c.symptoms || []).map((s) => ({
      id: s.id,
      type: s.type,
      severity: s.severity,
      date: s.date,
      notes: s.notes || undefined,
    })),
    isActive: c.isActive,
    isRegular: c.isRegular,
    notes: c.notes || undefined,
  }));

  const recentSymptomsFormatted = user.symptoms.map((s) => ({
    id: s.id,
    type: s.type,
    severity: s.severity,
    date: s.date,
    notes: s.notes || undefined,
  }));

  const lifestyleOverviewFormatted = user.lifestyleEntries.map((l) => ({
    id: l.id,
    date: l.date,
    sleep: l.sleep,
    stress: l.stress,
    hydration: l.hydration,
    exercise: l.exercise,
    mood: l.mood,
    notes: l.notes || undefined,
  }));

  const userFormatted = {
    id: user.id,
    name: user.name,
    age: user.age || 24,
    email: user.email,
    avatarUrl: user.avatarUrl || undefined,
    averageCycleLength: user.averageCycleLength,
    averagePeriodDuration: user.averagePeriodDuration,
    createdAt: user.createdAt.toISOString(),
  };

  res.json({
    user: userFormatted,
    currentCycle: currentCycleFormatted,
    currentCycleDay: analysis.currentCycleDay,
    deviation: analysis.deviation,
    prediction: predictions[0] || null,
    insights: analysis.insights,
    riskIndicators: analysis.riskIndicators,
    recentSymptoms: recentSymptomsFormatted,
    lifestyleOverview: lifestyleOverviewFormatted,
    cycleHistory: cycleHistoryFormatted,
  });
}
