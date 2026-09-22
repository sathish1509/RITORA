import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

function formatLifestyle(l: any) {
  return {
    id: l.id,
    date: l.date,
    sleep: l.sleep,
    stress: l.stress,
    hydration: l.hydration,
    exercise: l.exercise,
    mood: l.mood,
    notes: l.notes || undefined,
  };
}

export async function getLifestyle(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const { limit, startDate, endDate } = req.query;

  const whereClause: any = { userId };
  if (startDate || endDate) {
    whereClause.date = {};
    if (startDate) whereClause.date.gte = String(startDate);
    if (endDate) whereClause.date.lte = String(endDate);
  }

  const entries = await prisma.lifestyleEntry.findMany({
    where: whereClause,
    orderBy: { date: 'desc' },
    take: limit ? Number(limit) : 14,
  });

  res.json(entries.map(formatLifestyle));
}

export async function getLifestyleByDate(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const { date } = req.params;

  const entry = await prisma.lifestyleEntry.findUnique({
    where: {
      userId_date: { userId, date },
    },
  });

  if (!entry) {
    res.json(null);
    return;
  }

  res.json(formatLifestyle(entry));
}

export async function upsertLifestyle(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const { date, sleep, stress, hydration, exercise, mood, notes } = req.body;

  const entryDate = date || new Date().toISOString().split('T')[0];

  const sleepHours = sleep !== undefined ? Number(sleep) : 7.0;
  const stressLevel = stress ? String(stress).toLowerCase() : 'moderate';
  const hydrationLiters = hydration !== undefined ? Number(hydration) : 2.0;
  const exerciseMinutes = exercise !== undefined ? Number(exercise) : 30;
  const moodLevel = mood ? String(mood).toLowerCase() : 'okay';

  const entry = await prisma.lifestyleEntry.upsert({
    where: {
      userId_date: { userId, date: entryDate },
    },
    update: {
      sleep: sleepHours,
      stress: stressLevel,
      hydration: hydrationLiters,
      exercise: exerciseMinutes,
      mood: moodLevel,
      notes: notes || undefined,
    },
    create: {
      userId,
      date: entryDate,
      sleep: sleepHours,
      stress: stressLevel,
      hydration: hydrationLiters,
      exercise: exerciseMinutes,
      mood: moodLevel,
      notes: notes || undefined,
    },
  });

  res.status(201).json(formatLifestyle(entry));
}
