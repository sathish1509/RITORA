import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

function parseFlow(flowStr: string | null): string[] {
  if (!flowStr) return [];
  try {
    return JSON.parse(flowStr);
  } catch {
    return [];
  }
}

function calculateDaysDifference(startStr: string, endStr: string): number {
  const start = new Date(startStr);
  const end = new Date(endStr);
  const diffTime = end.getTime() - start.getTime();
  return Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1);
}

function formatCycle(c: any) {
  return {
    id: c.id,
    startDate: c.startDate,
    endDate: c.endDate,
    cycleLength: c.cycleLength,
    periodDuration: c.periodDuration || 5,
    flow: parseFlow(c.flow),
    symptoms: (c.symptoms || []).map((s: any) => ({
      id: s.id,
      type: s.type,
      severity: s.severity,
      date: s.date,
      notes: s.notes || undefined,
    })),
    isActive: c.isActive,
    isRegular: c.isRegular,
    notes: c.notes || undefined,
  };
}

export async function getCycles(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.id;

  const cycles = await prisma.cycle.findMany({
    where: { userId },
    include: { symptoms: true },
    orderBy: { startDate: 'desc' },
  });

  res.json(cycles.map(formatCycle));
}

export async function getCurrentCycle(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new AppError('User not found', 404);

  let current = await prisma.cycle.findFirst({
    where: { userId, isActive: true },
    include: { symptoms: true },
    orderBy: { startDate: 'desc' },
  });

  // Fallback to the latest cycle if none is marked active
  if (!current) {
    current = await prisma.cycle.findFirst({
      where: { userId },
      include: { symptoms: true },
      orderBy: { startDate: 'desc' },
    });
  }

  if (!current) {
    throw new AppError('No cycle records found', 404);
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const currentCycleDay = calculateDaysDifference(current.startDate, todayStr);
  const deviation = currentCycleDay - user.averageCycleLength;

  res.json({
    ...formatCycle(current),
    currentCycleDay,
    deviation,
    averageCycleLength: user.averageCycleLength,
  });
}

export async function createCycle(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const { startDate, flow, periodDuration, notes } = req.body;

  const cycleStartDate = startDate || new Date().toISOString().split('T')[0];

  // Close any currently active cycles
  const activeCycle = await prisma.cycle.findFirst({
    where: { userId, isActive: true },
  });

  if (activeCycle) {
    const cycleLength = calculateDaysDifference(activeCycle.startDate, cycleStartDate);
    await prisma.cycle.update({
      where: { id: activeCycle.id },
      data: {
        isActive: false,
        endDate: cycleStartDate,
        cycleLength,
      },
    });
  }

  // Create new active cycle
  const newCycle = await prisma.cycle.create({
    data: {
      userId,
      startDate: cycleStartDate,
      endDate: null,
      cycleLength: null,
      periodDuration: periodDuration ? Number(periodDuration) : 5,
      flow: JSON.stringify(flow || ['medium', 'heavy', 'medium', 'light', 'spotting']),
      isActive: true,
      isRegular: true,
      notes,
    },
    include: { symptoms: true },
  });

  // Update user lastPeriodStart
  await prisma.user.update({
    where: { id: userId },
    data: { lastPeriodStart: cycleStartDate },
  });

  res.status(201).json(formatCycle(newCycle));
}

export async function endCycle(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const { id } = req.params;
  const { endDate } = req.body;

  const cycle = await prisma.cycle.findFirst({
    where: { id, userId },
  });

  if (!cycle) throw new AppError('Cycle not found', 404);

  const cycleEndDate = endDate || new Date().toISOString().split('T')[0];
  const cycleLength = calculateDaysDifference(cycle.startDate, cycleEndDate);

  const updated = await prisma.cycle.update({
    where: { id: cycle.id },
    data: {
      isActive: false,
      endDate: cycleEndDate,
      cycleLength,
    },
    include: { symptoms: true },
  });

  res.json(formatCycle(updated));
}
