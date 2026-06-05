// src/modules/coupons/coupons.validator.ts
import { z } from 'zod';

export const createCouponSchema = z.object({
  code: z.string().min(3).max(20).toUpperCase(),
  description: z.string().max(500).optional(),
  discountType: z.enum(['PERCENTAGE', 'FIXED']),
  discountValue: z.number().positive(),
  minOrderValue: z.number().min(0).default(0),
  maxDiscount: z.number().positive().optional(),
  validFrom: z.string().datetime(),
  validUntil: z.string().datetime(),
  maxUsesPerUser: z.number().int().min(1).default(1),
  totalUsesLimit: z.number().int().min(1).optional(),
});

export const applyCouponSchema = z.object({
  code: z.string().min(1),
  orderTotal: z.number().positive(),
});

export type CreateCouponInput = z.infer<typeof createCouponSchema>;
export type ApplyCouponInput = z.infer<typeof applyCouponSchema>;
