import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { fetchUserHealthSnapshot, evaluateUserHealthSnapshot, generateHealthSummaryReport } from '../ai';

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
    generatedAt: r.generatedAt instanceof Date ? r.generatedAt.toISOString() : r.generatedAt,
    summary: r.summary,
    data: parsedData,
  };
}

export async function getReports(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.id;

  let reports = await prisma.report.findMany({
    where: { userId },
    orderBy: { generatedAt: 'desc' },
  });

  // If user has no reports yet, generate an initial comprehensive report from live data
  if (reports.length === 0) {
    const snapshot = await fetchUserHealthSnapshot(userId);
    if (snapshot) {
      const pipeline = evaluateUserHealthSnapshot(snapshot);
      const compiled = generateHealthSummaryReport(snapshot, pipeline, 'monthly');
      const initialReport = await prisma.report.create({
        data: {
          userId,
          title: compiled.title,
          type: compiled.type,
          summary: compiled.summary,
          dataJson: JSON.stringify(compiled.data),
        },
      });
      reports = [initialReport];
    }
  }

  res.json(reports.map(formatReport));
}

export async function generateReport(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const { type } = req.body;
  const reportType = type || 'monthly';

  const snapshot = await fetchUserHealthSnapshot(userId);
  if (!snapshot) throw new AppError('User not found', 404);

  // Execute unified modular AI pipeline
  const pipeline = evaluateUserHealthSnapshot(snapshot);

  // Assemble rich report payload
  const compiled = generateHealthSummaryReport(snapshot, pipeline, reportType);

  const report = await prisma.report.create({
    data: {
      userId,
      title: compiled.title,
      type: compiled.type,
      summary: compiled.summary,
      dataJson: JSON.stringify(compiled.data),
    },
  });

  res.status(201).json(formatReport(report));
}
