import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

function formatSymptom(s: any) {
  return {
    id: s.id,
    type: s.type,
    severity: s.severity,
    date: s.date,
    notes: s.notes || undefined,
  };
}

export async function getSymptoms(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const { startDate, endDate, type } = req.query;

  const whereClause: any = { userId };

  if (startDate || endDate) {
    whereClause.date = {};
    if (startDate) whereClause.date.gte = String(startDate);
    if (endDate) whereClause.date.lte = String(endDate);
  }

  if (type) {
    whereClause.type = String(type);
  }

  const symptoms = await prisma.symptom.findMany({
    where: whereClause,
    orderBy: { date: 'desc' },
  });

  res.json(symptoms.map(formatSymptom));
}

export async function getSymptomsByDate(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const { date } = req.params;

  const symptoms = await prisma.symptom.findMany({
    where: { userId, date },
    orderBy: { severity: 'desc' },
  });

  res.json(symptoms.map(formatSymptom));
}

export async function createSymptom(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const { type, severity, date, notes } = req.body;

  if (!type || !severity) {
    throw new AppError('Symptom type and severity (1-5) are required', 400);
  }

  const numSeverity = Number(severity);
  if (numSeverity < 1 || numSeverity > 5) {
    throw new AppError('Severity must be an integer between 1 and 5', 400);
  }

  const entryDate = date || new Date().toISOString().split('T')[0];

  // Try to associate with active cycle if date is >= active cycle start
  const activeCycle = await prisma.cycle.findFirst({
    where: { userId, isActive: true },
  });

  const cycleId = activeCycle && entryDate >= activeCycle.startDate ? activeCycle.id : undefined;

  const symptom = await prisma.symptom.create({
    data: {
      userId,
      cycleId,
      type: String(type).toLowerCase(),
      severity: numSeverity,
      date: entryDate,
      notes: notes || undefined,
    },
  });

  res.status(201).json(formatSymptom(symptom));
}

export async function deleteSymptom(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const { id } = req.params;

  const existing = await prisma.symptom.findFirst({
    where: { id, userId },
  });

  if (!existing) throw new AppError('Symptom not found', 404);

  await prisma.symptom.delete({
    where: { id },
  });

  res.json({ message: 'Symptom deleted successfully' });
}
