import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db';
import { config } from '../config/env';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

function formatUser(user: any) {
  return {
    id: user.id,
    name: user.name,
    age: user.age || 24,
    email: user.email,
    avatarUrl: user.avatarUrl || undefined,
    averageCycleLength: user.averageCycleLength,
    averagePeriodDuration: user.averagePeriodDuration,
    lastPeriodStart: user.lastPeriodStart || undefined,
    createdAt: user.createdAt.toISOString(),
  };
}

function generateToken(userId: string, email: string): string {
  return jwt.sign({ id: userId, email }, config.jwtSecret, { expiresIn: '7d' });
}

export async function register(req: AuthRequest, res: Response): Promise<void> {
  const { name, email, password, age, averageCycleLength, averagePeriodDuration, lastPeriodStart } = req.body;

  if (!email || !password || !name) {
    throw new AppError('Name, email, and password are required', 400);
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    throw new AppError('An account with this email already exists', 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      name: name.trim(),
      passwordHash,
      age: age ? Number(age) : 24,
      averageCycleLength: averageCycleLength ? Number(averageCycleLength) : 29,
      averagePeriodDuration: averagePeriodDuration ? Number(averagePeriodDuration) : 5,
      lastPeriodStart: lastPeriodStart || new Date().toISOString().split('T')[0],
    },
  });

  // Create initial active cycle
  const startDate = lastPeriodStart || new Date().toISOString().split('T')[0];
  await prisma.cycle.create({
    data: {
      userId: user.id,
      startDate,
      endDate: null,
      cycleLength: null,
      periodDuration: user.averagePeriodDuration,
      flow: JSON.stringify(['medium', 'heavy', 'heavy', 'medium', 'light']),
      isActive: true,
      isRegular: true,
    },
  });

  const token = generateToken(user.id, user.email);

  res.status(201).json({
    user: formatUser(user),
    token,
  });
}

export async function login(req: AuthRequest, res: Response): Promise<void> {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = generateToken(user.id, user.email);

  res.json({
    user: formatUser(user),
    token,
  });
}

export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  if (!req.user?.id) {
    throw new AppError('Unauthorized', 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json(formatUser(user));
}

function parseSleepHours(val: any): number {
  if (typeof val === 'number') return val;
  if (!val) return 7.5;
  const s = String(val).trim();
  if (s === '<5') return 4.5;
  if (s === '5-6') return 5.5;
  if (s === '7-8') return 7.5;
  if (s === '8+') return 8.5;
  const parsed = parseFloat(s);
  return isNaN(parsed) ? 7.5 : parsed;
}

function parseStressLevel(val: any): string {
  if (!val) return 'moderate';
  const s = String(val).toLowerCase().trim();
  if (s === 'very high' || s === 'very-high' || s === 'very_high') return 'very-high';
  if (s === 'high') return 'high';
  if (s === 'moderate' || s === 'medium') return 'moderate';
  if (s === 'low') return 'low';
  return 'moderate';
}

function parseExerciseMinutes(val: any): number {
  if (typeof val === 'number') return val;
  if (!val) return 25;
  const s = String(val).toLowerCase().trim();
  if (s === 'rarely' || s === 'none') return 10;
  if (s === '2-3x/week' || s === 'moderate') return 30;
  if (s === 'daily' || s === 'high') return 45;
  const parsed = parseInt(s, 10);
  return isNaN(parsed) ? 25 : parsed;
}

export async function updateProfile(req: AuthRequest, res: Response): Promise<void> {
  if (!req.user?.id) {
    throw new AppError('Unauthorized', 401);
  }

  const userId = req.user.id;
  const {
    name,
    age,
    averageCycleLength,
    averagePeriodDuration,
    avatarUrl,
    lastPeriodStart,
    sleep,
    sleepHours,
    stress,
    stressLevel,
    exercise,
    exerciseFrequency,
    exerciseMinutes,
  } = req.body;

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(name && { name: name.trim() }),
      ...(age && { age: Number(age) }),
      ...(averageCycleLength && { averageCycleLength: Number(averageCycleLength) }),
      ...(averagePeriodDuration && { averagePeriodDuration: Number(averagePeriodDuration) }),
      ...(avatarUrl !== undefined && { avatarUrl }),
      ...(lastPeriodStart && { lastPeriodStart }),
    },
  });

  // If lifestyle fields provided, upsert ONLY today's entry (no historical ghost-seeding)
  const rawSleep = sleep ?? sleepHours;
  const rawStress = stress ?? stressLevel;
  const rawExercise = exercise ?? exerciseFrequency ?? exerciseMinutes;

  if (rawSleep !== undefined || rawStress !== undefined || rawExercise !== undefined) {
    const sleepVal = parseSleepHours(rawSleep);
    const stressVal = parseStressLevel(rawStress);
    const exerciseVal = parseExerciseMinutes(rawExercise);
    const hydrationVal = 2.0;
    const moodVal = stressVal === 'high' || stressVal === 'very-high' ? 'low' : 'good';
    const todayStr = new Date().toISOString().split('T')[0];

    await prisma.lifestyleEntry.upsert({
      where: { userId_date: { userId, date: todayStr } },
      update: { sleep: sleepVal, stress: stressVal, exercise: exerciseVal, hydration: hydrationVal, mood: moodVal },
      create: { userId, date: todayStr, sleep: sleepVal, stress: stressVal, exercise: exerciseVal, hydration: hydrationVal, mood: moodVal },
    });
  }

  res.json(formatUser(user));
}

export async function submitOnboarding(req: AuthRequest, res: Response): Promise<void> {
  if (!req.user?.id) {
    throw new AppError('Unauthorized', 401);
  }

  const userId = req.user.id;
  const {
    averageCycleLength,
    averagePeriodDuration,
    lastPeriodStart,
    sleep,
    sleepHours,
    stress,
    stressLevel,
    exercise,
    exerciseFrequency,
    exerciseMinutes,
  } = req.body;

  // 1. Update User Profile Settings
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(averageCycleLength && { averageCycleLength: Number(averageCycleLength) }),
      ...(averagePeriodDuration && { averagePeriodDuration: Number(averagePeriodDuration) }),
      ...(lastPeriodStart && { lastPeriodStart }),
    },
  });

  // 2. Synchronize Active Cycle with Onboarding Date
  const cycleStartDate = lastPeriodStart || user.lastPeriodStart || new Date().toISOString().split('T')[0];
  const activeCycle = await prisma.cycle.findFirst({
    where: { userId, isActive: true },
  });

  if (activeCycle) {
    await prisma.cycle.update({
      where: { id: activeCycle.id },
      data: {
        startDate: cycleStartDate,
        periodDuration: Number(averagePeriodDuration) || activeCycle.periodDuration || 5,
      },
    });
  } else {
    await prisma.cycle.create({
      data: {
        userId,
        startDate: cycleStartDate,
        endDate: null,
        periodDuration: Number(averagePeriodDuration) || 5,
        flow: JSON.stringify(['medium', 'heavy', 'heavy', 'medium', 'light']),
        isActive: true,
        isRegular: true,
      },
    });
  }

  // 3. Save ONLY today's lifestyle entry — no ghost-seeding of fake history.
  //    Users build their real history day-by-day through daily logging.
  const rawSleep = sleep ?? sleepHours;
  const rawStress = stress ?? stressLevel;
  const rawExercise = exercise ?? exerciseFrequency ?? exerciseMinutes;

  if (rawSleep !== undefined || rawStress !== undefined || rawExercise !== undefined) {
    const sleepVal = parseSleepHours(rawSleep);
    const stressVal = parseStressLevel(rawStress);
    const exerciseVal = parseExerciseMinutes(rawExercise);
    const hydrationVal = 2.0;
    const moodVal = stressVal === 'high' || stressVal === 'very-high' ? 'low' : 'good';
    const todayStr = new Date().toISOString().split('T')[0];

    await prisma.lifestyleEntry.upsert({
      where: { userId_date: { userId, date: todayStr } },
      update: { sleep: sleepVal, stress: stressVal, exercise: exerciseVal, hydration: hydrationVal, mood: moodVal },
      create: { userId, date: todayStr, sleep: sleepVal, stress: stressVal, exercise: exerciseVal, hydration: hydrationVal, mood: moodVal },
    });
  }

  res.json({
    user: formatUser(user),
    message: 'Onboarding completed and lifestyle baseline initialized successfully',
  });
}
