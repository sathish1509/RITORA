import app from './app';
import { config } from './config/env';

const server = app.listen(config.port, () => {
  console.log(`
  ======================================================
  🟣 RITORA Health Intelligence Backend API
  📡 Server running on: http://localhost:${config.port}
  🩺 Health check: http://localhost:${config.port}/api/health
  ======================================================
  `);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});
