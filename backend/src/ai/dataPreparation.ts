import { prisma } from '../config/db';
import { UserHealthSnapshot, CycleRecord, SymptomRecord, LifestyleRecord } from './types';

export function calculateDaysDifference(startStr: string, endStr: string): number {
  const start = new Date(startStr);
  const end = new Date(endStr);
  const diffTime = end.getTime() - start.getTime();
  return Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1);
}

export function formatDateToISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Data Aggregation & Preparation Layer
 * Fetches user records and maps them cleanly into standardized pure AI domain DTOs.
 */
export async function fetchUserHealthSnapshot(userId: string): Promise<UserHealthSnapshot | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      cycles: { orderBy: { startDate: 'desc' }, take: 12 },
      symptoms: { orderBy: { date: 'desc' }, take: 50 },
      lifestyleEntries: { orderBy: { date: 'desc' }, take: 30 },
    },
  });

  if (!user) return null;

  const cycles: CycleRecord[] = user.cycles.map((c) => ({
    id: c.id,
    startDate: c.startDate,
    endDate: c.endDate,
    cycleLength: c.cycleLength,
    periodDuration: c.periodDuration,
    flow: c.flow,
    isActive: c.isActive,
  }));

  const symptoms: SymptomRecord[] = user.symptoms.map((s) => ({
    id: s.id,
    type: s.type,
    severity: s.severity,
    date: s.date,
    notes: s.notes,
  }));

  const lifestyle: LifestyleRecord[] = user.lifestyleEntries.map((l) => ({
    id: l.id,
    date: l.date,
    sleep: l.sleep,
    stress: l.stress,
    hydration: l.hydration,
    exercise: l.exercise,
    mood: l.mood,
  }));

  return {
    user: {
      id: user.id,
      name: user.name,
      averageCycleLength: user.averageCycleLength || 28,
      averagePeriodDuration: user.averagePeriodDuration || 5,
    },
    cycles,
    symptoms,
    lifestyle,
  };
}
