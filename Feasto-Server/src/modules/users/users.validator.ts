// src/modules/users/users.validator.ts
import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(10).optional(),
  avatarUrl: z.string().url().optional()
});

export const createAddressSchema = z.object({
  type: z.enum(['HOME', 'WORK', 'OTHER']).default('HOME'),
  street: z.string().min(3),
  city: z.string().min(2),
  state: z.string().min(2),
  zipCode: z.string().min(4),
  country: z.string().default('India'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  isDefault: z.boolean().default(false)
});

export const updateAddressSchema = createAddressSchema.partial();

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
