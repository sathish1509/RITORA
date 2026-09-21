import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 3001,
  databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
  jwtSecret: process.env.JWT_SECRET || 'ritora_default_dev_secret_key_2026',
  corsOrigins: (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:8081,http://localhost:3000').split(','),
  geminiApiKey: process.env.GEMINI_API_KEY || '',
};
