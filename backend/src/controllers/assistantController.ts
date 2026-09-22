import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { generateAssistantResponse } from '../services/geminiService';

export async function getMessages(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.id;

  const messages = await prisma.chatMessage.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
  });

  res.json(
    messages.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      timestamp: m.createdAt.toISOString(),
    }))
  );
}

export async function chat(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.id;
  const { message } = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    throw new AppError('Message is required', 400);
  }

  // 1. Save user message
  const userMsg = await prisma.chatMessage.create({
    data: {
      userId,
      role: 'user',
      content: message.trim(),
    },
  });

  // 2. Generate AI response
  const aiReply = await generateAssistantResponse(userId, message.trim());

  // 3. Save assistant message
  const assistantMsg = await prisma.chatMessage.create({
    data: {
      userId,
      role: 'assistant',
      content: aiReply,
    },
  });

  const formattedAssistantMsg = {
    id: assistantMsg.id,
    role: assistantMsg.role,
    content: assistantMsg.content,
    timestamp: assistantMsg.createdAt.toISOString(),
  };

  res.status(201).json({
    userMessage: {
      id: userMsg.id,
      role: userMsg.role,
      content: userMsg.content,
      timestamp: userMsg.createdAt.toISOString(),
    },
    assistantMessage: formattedAssistantMsg,
    reply: formattedAssistantMsg,
  });
}
