// src/shared/utils/apiResponse.ts
import { Response } from 'express';

interface ApiResponseOptions {
  success: boolean;
  message: string;
  data?: unknown;
  error?: unknown;
  statusCode?: number;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export const sendResponse = (
  res: Response,
  options: ApiResponseOptions
): void => {
  const { success, message, data = null, error = null, statusCode = 200, meta } = options;

  res.status(statusCode).json({
    success,
    message,
    data,
    error,
    ...(meta && { meta }),
  });
};

export const sendSuccess = (
  res: Response,
  message: string,
  data?: unknown,
  statusCode = 200,
  meta?: PaginationMeta
): void => {
  sendResponse(res, { success: true, message, data, statusCode, meta });
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 400,
  error?: unknown
): void => {
  sendResponse(res, { success: false, message, error, statusCode });
};

export const getPaginationMeta = (
  total: number,
  page: number,
  limit: number
): PaginationMeta => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
  hasNext: page < Math.ceil(total / limit),
  hasPrev: page > 1,
});

export const getPaginationParams = (query: { page?: string; limit?: string }) => {
  const page = Math.max(1, parseInt(query.page || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '10')));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};
