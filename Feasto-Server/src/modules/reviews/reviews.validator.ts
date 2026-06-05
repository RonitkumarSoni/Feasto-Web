// src/modules/reviews/reviews.validator.ts
import { z } from 'zod';

export const createReviewSchema = z.object({
  restaurantId: z.string().uuid().optional(),
  foodId: z.string().uuid().optional(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
}).refine(data => data.restaurantId || data.foodId, {
  message: 'Either restaurantId or foodId must be provided',
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
