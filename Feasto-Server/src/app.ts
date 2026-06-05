import express from 'express';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import { env } from './shared/config/env';
import logger from './shared/logger';
import { globalErrorHandler, notFoundHandler } from './shared/middleware/errorHandler';
import { apiLimiter } from './shared/middleware/rateLimiter';
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import restaurantsRoutes from './modules/restaurants/restaurants.routes';
import foodsRoutes from './modules/foods/foods.routes';
import cartsRoutes from './modules/carts/carts.routes';
import ordersRoutes from './modules/orders/orders.routes';
import paymentsRoutes from './modules/payments/payments.routes';
import deliveryRoutes from './modules/delivery/delivery.routes';
import reviewsRoutes from './modules/reviews/reviews.routes';
import couponsRoutes from './modules/coupons/coupons.routes';
import notificationsRoutes from './modules/notifications/notifications.routes';
import adminRoutes from './modules/admin/admin.routes';
import uploadRoutes from './modules/upload/upload.routes';

const app = express();

// Initialize Sentry
if (env.SENTRY_DSN) {
  Sentry.init({
    dsn: env.SENTRY_DSN,
    integrations: [
      nodeProfilingIntegration(),
    ],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
  });
  Sentry.setupExpressErrorHandler(app);
}

// Security & Parsing
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN.split(','),
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging & Rate Limiting
app.use(
  pinoHttp({
    logger,
    autoLogging: {
      ignore: (req) => req.url === '/health' || req.url === '/api/docs',
    },
  })
);
app.use(apiLimiter);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// API Routes
app.use(`${env.API_PREFIX}/auth`, authRoutes);
app.use(`${env.API_PREFIX}/users`, usersRoutes);
app.use(`${env.API_PREFIX}/restaurants`, restaurantsRoutes);
app.use(`${env.API_PREFIX}/foods`, foodsRoutes);
app.use(`${env.API_PREFIX}/carts`, cartsRoutes);
app.use(`${env.API_PREFIX}/orders`, ordersRoutes);
app.use(`${env.API_PREFIX}/payments`, paymentsRoutes);
app.use(`${env.API_PREFIX}/delivery`, deliveryRoutes);
app.use(`${env.API_PREFIX}/reviews`, reviewsRoutes);
app.use(`${env.API_PREFIX}/coupons`, couponsRoutes);
app.use(`${env.API_PREFIX}/notifications`, notificationsRoutes);
app.use(`${env.API_PREFIX}/admin`, adminRoutes);
app.use(`${env.API_PREFIX}/upload`, uploadRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
