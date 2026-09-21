import express, { Request, Response } from 'express';
import cors from 'cors';
import { config } from './config/env';
import { errorHandler, AppError } from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import cycleRoutes from './routes/cycleRoutes';
import symptomRoutes from './routes/symptomRoutes';
import lifestyleRoutes from './routes/lifestyleRoutes';
import insightRoutes from './routes/insightRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import assistantRoutes from './routes/assistantRoutes';
import reportRoutes from './routes/reportRoutes';

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (config.corsOrigins.indexOf(origin) !== -1 || config.corsOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());

// Request logging in development
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'RITORA Health Intelligence API',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cycles', cycleRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/lifestyle', lifestyleRoutes);
app.use('/api/insights', insightRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/reports', reportRoutes);

// 404 Handler
app.use((req, _res, next) => {
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404));
});

// Global Error Handler
app.use(errorHandler);

export default app;
