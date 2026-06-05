// src/modules/delivery/delivery.validator.ts
import { z } from 'zod';

export const updateLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const updateDeliveryStatusSchema = z.object({
  status: z.enum(['AT_RESTAURANT', 'PICKED_UP', 'ON_THE_WAY', 'DELIVERED']),
});

export const registerPartnerSchema = z.object({
  vehicleType: z.string().min(1),
  vehicleNumber: z.string().min(1),
});

export type UpdateLocationInput = z.infer<typeof updateLocationSchema>;
export type UpdateDeliveryStatusInput = z.infer<typeof updateDeliveryStatusSchema>;
export type RegisterPartnerInput = z.infer<typeof registerPartnerSchema>;
