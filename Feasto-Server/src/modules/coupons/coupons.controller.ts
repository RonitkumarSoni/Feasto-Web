// src/modules/coupons/coupons.controller.ts
import { Request, Response, NextFunction } from 'express';
import { CouponsService } from './coupons.service';
import { createCouponSchema, applyCouponSchema } from './coupons.validator';
import { sendSuccess } from '../../shared/utils/apiResponse';

export class CouponsController {
  private service: CouponsService;

  constructor() {
    this.service = new CouponsService();
    this.create = this.create.bind(this);
    this.getAll = this.getAll.bind(this);
    this.getActive = this.getActive.bind(this);
    this.apply = this.apply.bind(this);
    this.remove = this.remove.bind(this);
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const input = createCouponSchema.parse(req.body);
      const coupon = await this.service.create(input);
      sendSuccess(res, 'Coupon created', { coupon }, 201);
    } catch (e) {
      next(e);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await this.service.getAll(page, limit);
      sendSuccess(res, 'All coupons', result);
    } catch (e) {
      next(e);
    }
  }

  async getActive(req: Request, res: Response, next: NextFunction) {
    try {
      const coupons = await this.service.getActive();
      sendSuccess(res, 'Active coupons', { coupons });
    } catch (e) {
      next(e);
    }
  }

  async apply(req: Request, res: Response, next: NextFunction) {
    try {
      const input = applyCouponSchema.parse(req.body);
      // @ts-ignore
      const result = await this.service.applyCoupon(req.user!.userId, input.code, input.orderTotal);
      sendSuccess(res, 'Coupon applied', result);
    } catch (e) {
      next(e);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await this.service.remove(req.params.id);
      sendSuccess(res, 'Coupon deleted');
    } catch (e) {
      next(e);
    }
  }
}
