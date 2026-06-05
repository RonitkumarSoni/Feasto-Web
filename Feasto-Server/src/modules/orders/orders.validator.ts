// src/modules/orders/orders.validator.ts
import { z } from 'zod';

export const createOrderSchema = z.object({
  restaurantId: z.string().uuid(),
  deliveryAddressId: z.string().uuid(),
  specialInstructions: z.string().max(500).optional(),
  couponCode: z.string().optional(),
  paymentMethod: z.enum(['COD', 'RAZORPAY']).default('COD'),
  items: z.array(z.object({
    foodId: z.string().uuid(),
    variantId: z.string().uuid().optional(),
    addonId: z.string().uuid().optional(),
    quantity: z.number().int().min(1).max(20),
  })).min(1, 'At least one item is required'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'ACCEPTED',
    'PREPARING',
    'READY_FOR_PICKUP',
    'PICKED_UP',
    'ON_THE_WAY',
    'DELIVERED',
    'CANCELLED',
  ]),
  cancellationReason: z.string().max(500).optional(),
});

export const orderQuerySchema = z.object({
  status: z.enum([
    'PENDING', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP',
    'PICKED_UP', 'ON_THE_WAY', 'DELIVERED', 'CANCELLED',
  ]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type OrderQueryInput = z.infer<typeof orderQuerySchema>;
