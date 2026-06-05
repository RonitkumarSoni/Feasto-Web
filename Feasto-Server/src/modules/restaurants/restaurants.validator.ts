// src/modules/restaurants/restaurants.validator.ts
import { z } from 'zod';

export const createRestaurantSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  address: z.string().min(5),
  contactPhone: z.string().min(10),
  contactEmail: z.string().email().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  deliveryRadius: z.number().positive().default(5.0),
  minOrderValue: z.number().min(0).default(0),
  taxRate: z.number().min(0).default(5.0)
});

export const updateRestaurantSchema = createRestaurantSchema.partial();

export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>;
export type UpdateRestaurantInput = z.infer<typeof updateRestaurantSchema>;
