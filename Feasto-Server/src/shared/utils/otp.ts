// src/shared/utils/otp.ts
import { randomInt } from 'crypto';

export const generateOTP = (length = 6): string => {
  const max = Math.pow(10, length);
  const min = Math.pow(10, length - 1);
  return String(randomInt(min, max));
};

export const isOTPExpired = (createdAt: Date, expiryMinutes: number): boolean => {
  const now = Date.now();
  const created = new Date(createdAt).getTime();
  return now - created > expiryMinutes * 60 * 1000;
};
