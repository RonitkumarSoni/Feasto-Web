// src/modules/foods/foods.validator.ts
import { z } from 'zod';

export const createFoodSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  basePrice: z.number().min(0),
  isVeg: z.boolean().default(true),
  categoryId: z.string().uuid().optional(),
  restaurantId: z.string().uuid()
});

export const updateFoodSchema = createFoodSchema.omit({ restaurantId: true }).partial();

export const createVariantSchema = z.object({
  name: z.string().min(1),
  price: z.number().min(0)
});

export const createAddonSchema = z.object({
  name: z.string().min(1),
  price: z.number().min(0)
});

export type CreateFoodInput = z.infer<typeof createFoodSchema>;
export type UpdateFoodInput = z.infer<typeof updateFoodSchema>;
export type CreateVariantInput = z.infer<typeof createVariantSchema>;
export type CreateAddonInput = z.infer<typeof createAddonSchema>;
