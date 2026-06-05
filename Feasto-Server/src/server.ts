// src/server.ts
import http from 'http';
import app from './app';
import { env } from './shared/config/env';
import logger from './shared/logger';

const server = http.createServer(app);

import { initSocket } from './shared/realtime/socket';
initSocket(server);

const startServer = async () => {
  try {
    // TODO: Connect Prisma & Redis

    server.listen(env.PORT, () => {
      logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
      logger.info(`👉 API: http://localhost:${env.PORT}${env.API_PREFIX}`);
    });
  } catch (error) {
    logger.error({ err: error }, 'Failed to start server');
    process.exit(1);
  }
};

startServer();

// Graceful Shutdown
const shutdown = () => {
  logger.info('SIGTERM/SIGINT received, shutting down gracefully...');
  server.close(() => {
    logger.info('HTTP server closed');
    // TODO: Disconnect Prisma & Redis
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
