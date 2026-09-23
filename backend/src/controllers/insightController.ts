import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { fetchUserHealthSnapshot, evaluateUserHealthSnapshot } from '../ai';

function parseFlow(flowStr: string | null): string[] {
  if (!flowStr) return [];
  try {
    const parsed = JSON.parse(flowStr);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return flowStr ? [flowStr] : [];
  }
}

export async function getInsights(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const snapshot = await fetchUserHealthSnapshot(userId);

  if (!snapshot) {
    res.json([]);
    return;
  }

  const analysis = evaluateUserHealthSnapshot(snapshot);
  res.json(analysis.insights);
}

export async function getRisks(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const snapshot = await fetchUserHealthSnapshot(userId);

  if (!snapshot) {
    res.json([]);
    return;
  }

  const analysis = evaluateUserHealthSnapshot(snapshot);
  res.json(analysis.riskScreening);
}

export async function getPredictions(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const snapshot = await fetchUserHealthSnapshot(userId);

  if (!snapshot) {
    res.json([]);
    return;
  }

  const analysis = evaluateUserHealthSnapshot(snapshot);
  res.json([
    {
      id: 'pred_active',
      predictedDate: analysis.prediction.predictedStartDate,
      confidence: analysis.prediction.confidence,
      basedOn: analysis.prediction.basedOn,
      estimatedWindowStart: analysis.prediction.estimatedWindowStart,
      estimatedWindowEnd: analysis.prediction.estimatedWindowEnd,
    },
  ]);
}

export async function getDashboard(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.id;

  const [user, snapshot] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: {
        cycles: {
          orderBy: { startDate: 'desc' },
          include: { symptoms: true },
        },
        symptoms: {
          orderBy: { date: 'desc' },
          take: 10,
        },
        lifestyleEntries: {
          orderBy: { date: 'desc' },
          take: 14,
        },
      },
    }),
    fetchUserHealthSnapshot(userId),
  ]);

  if (!user || !snapshot) throw new AppError('User not found', 404);

  // Execute full modular AI intelligence pipeline
  const pipeline = evaluateUserHealthSnapshot(snapshot);

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

  const predictionFormatted = {
    id: 'pred_active',
    predictedDate: pipeline.prediction.predictedStartDate,
    confidence: pipeline.prediction.confidence,
    basedOn: pipeline.prediction.basedOn,
    estimatedWindowStart: pipeline.prediction.estimatedWindowStart,
    estimatedWindowEnd: pipeline.prediction.estimatedWindowEnd,
  };

  res.json({
    user: userFormatted,
    currentCycle: currentCycleFormatted,
    currentCycleDay: pipeline.pattern.currentCycleDay,
    deviation: pipeline.pattern.deviationDays,
    prediction: predictionFormatted,
    insights: pipeline.insights,
    riskIndicators: pipeline.riskScreening,
    evidence: pipeline.evidence,
    whatChanged: pipeline.whatChanged,
    recommendations: pipeline.recommendations,
    recentSymptoms: recentSymptomsFormatted,
    lifestyleOverview: lifestyleOverviewFormatted,
    cycleHistory: cycleHistoryFormatted,
  });
}
