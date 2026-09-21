import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

function formatReport(r: any) {
  let parsedData = {};
  try {
    parsedData = JSON.parse(r.dataJson);
  } catch {
    parsedData = {};
  }

  return {
    id: r.id,
    title: r.title,
    type: r.type,
    generatedAt: r.generatedAt.toISOString().split('T')[0],
    summary: r.summary,
    data: parsedData,
  };
}

export async function getReports(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.id;

  const reports = await prisma.report.findMany({
    where: { userId },
    orderBy: { generatedAt: 'desc' },
  });

  res.json(reports.map(formatReport));
}

export async function generateReport(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const { type } = req.body;

  const reportType = type || 'monthly';

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      cycles: { orderBy: { startDate: 'desc' } },
      symptoms: { orderBy: { date: 'desc' } },
      lifestyleEntries: { orderBy: { date: 'desc' } },
    },
  });

  if (!user) throw new AppError('User not found', 404);

  // Compute aggregate statistics
  const completedCycles = user.cycles.filter((c) => c.cycleLength !== null);
  const cycleLengths = completedCycles.map((c) => c.cycleLength as number);

  const avgCycleLength =
    cycleLengths.length > 0
      ? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length)
      : user.averageCycleLength;

  const longestCycle = cycleLengths.length > 0 ? Math.max(...cycleLengths) : user.averageCycleLength;
  const shortestCycle = cycleLengths.length > 0 ? Math.min(...cycleLengths) : user.averageCycleLength;

  // Symptom counts
  const symptomMap: Record<string, number> = {};
  for (const s of user.symptoms) {
    symptomMap[s.type] = (symptomMap[s.type] || 0) + 1;
  }
  const commonSymptoms = Object.entries(symptomMap)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Lifestyle averages
  const entries = user.lifestyleEntries;
  const avgSleep = entries.length > 0 ? Number((entries.reduce((sum, e) => sum + e.sleep, 0) / entries.length).toFixed(1)) : 7.0;
  const avgHydration = entries.length > 0 ? Number((entries.reduce((sum, e) => sum + e.hydration, 0) / entries.length).toFixed(1)) : 2.0;
  const avgExercise = entries.length > 0 ? Math.round(entries.reduce((sum, e) => sum + e.exercise, 0) / entries.length) : 30;

  const highStressCount = entries.filter((e) => ['high', 'very-high'].includes(e.stress.toLowerCase())).length;
  const stressSummary = highStressCount >= entries.length / 2 ? 'high' : 'moderate';

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const now = new Date();
  const currentMonthName = monthNames[now.getMonth()];
  const currentYear = now.getFullYear();

  const title = `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Health Summary — ${currentMonthName} ${currentYear}`;
  const summary = `Health analysis for ${currentMonthName} ${currentYear}. Tracked ${completedCycles.length} completed cycles with an average length of ${avgCycleLength} days. Lifestyle metrics show an average of ${avgSleep}h sleep and ${avgHydration}L daily hydration.`;

  const reportData = {
    cycleCount: completedCycles.length,
    averageCycleLength: avgCycleLength,
    longestCycle,
    shortestCycle,
    commonSymptoms,
    lifestyleAverages: {
      sleep: avgSleep,
      stress: stressSummary,
      hydration: avgHydration,
      exercise: avgExercise,
    },
  };

  const report = await prisma.report.create({
    data: {
      userId,
      title,
      type: reportType,
      summary,
      dataJson: JSON.stringify(reportData),
    },
  });

  res.status(201).json(formatReport(report));
}
