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

export async function updateProfile(req: AuthRequest, res: Response): Promise<void> {
  if (!req.user?.id) {
    throw new AppError('Unauthorized', 401);
  }

  const { name, age, averageCycleLength, averagePeriodDuration, avatarUrl, lastPeriodStart } = req.body;

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      ...(name && { name: name.trim() }),
      ...(age && { age: Number(age) }),
      ...(averageCycleLength && { averageCycleLength: Number(averageCycleLength) }),
      ...(averagePeriodDuration && { averagePeriodDuration: Number(averagePeriodDuration) }),
      ...(avatarUrl !== undefined && { avatarUrl }),
      ...(lastPeriodStart && { lastPeriodStart }),
    },
  });

  res.json(formatUser(user));
}
