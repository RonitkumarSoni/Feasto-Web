// src/modules/payments/payments.validator.ts
import { z } from 'zod';

export const initiatePaymentSchema = z.object({
  orderId: z.string().uuid(),
});

export const verifyPaymentSchema = z.object({
  orderId: z.string().uuid(),
  razorpayPaymentId: z.string().min(1),
  razorpayOrderId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});

export type InitiatePaymentInput = z.infer<typeof initiatePaymentSchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
