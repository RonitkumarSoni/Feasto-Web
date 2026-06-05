// src/shared/middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';
import { env } from '../config/env';
import { sendError } from '../utils/apiResponse';

export const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  handler: (req, res) => {
    sendError(res, 'Too many requests, please try again later.', 429);
  },
  standardHeaders: true,
  legacyHeaders: false,
});
