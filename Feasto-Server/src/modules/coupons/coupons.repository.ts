// src/modules/coupons/coupons.repository.ts
import { prisma } from '../../shared/utils/prisma';
import { CreateCouponInput } from './coupons.validator';

export class CouponsRepository {

  async create(data: CreateCouponInput) {
    return prisma.coupon.create({
      data: {
        code: data.code,
        description: data.description,
        discountType: data.discountType,
        discountValue: data.discountValue,
        minOrderValue: data.minOrderValue,
        maxDiscount: data.maxDiscount,
        validFrom: new Date(data.validFrom),
        validUntil: new Date(data.validUntil),
        maxUsesPerUser: data.maxUsesPerUser,
        totalUsesLimit: data.totalUsesLimit,
      },
    });
  }

  async findByCode(code: string) {
    return prisma.coupon.findUnique({ where: { code } });
  }

  async findAll(page = 1, limit = 20) {
    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.coupon.count(),
    ]);
    return { coupons, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findActive() {
    const now = new Date();
    return prisma.coupon.findMany({
      where: {
        isActive: true,
        validFrom: { lte: now },
        validUntil: { gte: now },
      },
    });
  }

  async getUserUsageCount(userId: string, couponId: string) {
    return prisma.couponUsage.count({
      where: { couponId, order: { userId } },
    });
  }

  async getTotalUsageCount(couponId: string) {
    return prisma.couponUsage.count({ where: { couponId } });
  }

  async toggleActive(couponId: string, isActive: boolean) {
    return prisma.coupon.update({
      where: { id: couponId },
      data: { isActive },
    });
  }

  async delete(couponId: string) {
    return prisma.coupon.delete({ where: { id: couponId } });
  }
}
