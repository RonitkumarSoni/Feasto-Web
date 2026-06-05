// src/modules/carts/carts.validator.ts
import { z } from 'zod';

export const addCartItemSchema = z.object({
  foodId: z.string().uuid(),
  variantId: z.string().uuid().optional(),
  addonId: z.string().uuid().optional(),
  quantity: z.number().int().min(1).default(1)
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1)
});

export type AddCartItemInput = z.infer<typeof addCartItemSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
