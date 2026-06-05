// src/modules/coupons/coupons.service.ts
import { CouponsRepository } from './coupons.repository';
import { CreateCouponInput } from './coupons.validator';
import { AppError } from '../../shared/middleware/errorHandler';

export class CouponsService {
  private repository: CouponsRepository;

  constructor() {
    this.repository = new CouponsRepository();
  }

  async create(input: CreateCouponInput) {
    const existing = await this.repository.findByCode(input.code);
    if (existing) throw new AppError('Coupon code already exists', 400);
    return this.repository.create(input);
  }

  async getAll(page = 1, limit = 20) {
    return this.repository.findAll(page, limit);
  }

  async getActive() {
    return this.repository.findActive();
  }

  async applyCoupon(userId: string, code: string, orderTotal: number) {
    const coupon = await this.repository.findByCode(code);
    if (!coupon) throw new AppError('Coupon not found', 404);

    const now = new Date();
    if (!coupon.isActive) throw new AppError('Coupon is not active', 400);
    if (now < coupon.validFrom || now > coupon.validUntil) {
      throw new AppError('Coupon has expired or is not yet valid', 400);
    }
    if (orderTotal < coupon.minOrderValue) {
      throw new AppError(`Minimum order value is ₹${coupon.minOrderValue}`, 400);
    }

    // Check user usage limit
    const userUsage = await this.repository.getUserUsageCount(userId, coupon.id);
    if (userUsage >= coupon.maxUsesPerUser) {
      throw new AppError('You have already used this coupon the maximum number of times', 400);
    }

    // Check total usage limit
    if (coupon.totalUsesLimit) {
      const totalUsage = await this.repository.getTotalUsageCount(coupon.id);
      if (totalUsage >= coupon.totalUsesLimit) {
        throw new AppError('Coupon usage limit reached', 400);
      }
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discount = (orderTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    discount = Math.min(discount, orderTotal); // Can't discount more than order total

    return {
      couponId: coupon.id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      calculatedDiscount: Math.round(discount * 100) / 100,
    };
  }

  async toggleActive(couponId: string) {
    const coupon = await this.repository.findByCode(couponId);
    // Try by ID directly
    return this.repository.toggleActive(couponId, true);
  }

  async remove(couponId: string) {
    return this.repository.delete(couponId);
  }
}
