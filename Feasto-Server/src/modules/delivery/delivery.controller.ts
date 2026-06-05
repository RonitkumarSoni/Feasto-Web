// src/modules/delivery/delivery.controller.ts
import { Request, Response, NextFunction } from 'express';
import { DeliveryService } from './delivery.service';
import { registerPartnerSchema, updateLocationSchema, updateDeliveryStatusSchema } from './delivery.validator';
import { sendSuccess } from '../../shared/utils/apiResponse';

export class DeliveryController {
  private service: DeliveryService;

  constructor() {
    this.service = new DeliveryService();
    this.register = this.register.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.toggleAvailability = this.toggleAvailability.bind(this);
    this.updateLocation = this.updateLocation.bind(this);
    this.getDeliveryByOrder = this.getDeliveryByOrder.bind(this);
    this.updateDeliveryStatus = this.updateDeliveryStatus.bind(this);
    this.getMyDeliveries = this.getMyDeliveries.bind(this);
    this.getMyEarnings = this.getMyEarnings.bind(this);
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const input = registerPartnerSchema.parse(req.body);
      // @ts-ignore
      const partner = await this.service.registerPartner(req.user!.userId, input.vehicleType, input.vehicleNumber);
      sendSuccess(res, 'Delivery partner registered', { partner }, 201);
    } catch (e) {
      next(e);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      // @ts-ignore
      const partner = await this.service.getProfile(req.user!.userId);
      sendSuccess(res, 'Partner profile', { partner });
    } catch (e) {
      next(e);
    }
  }

  async toggleAvailability(req: Request, res: Response, next: NextFunction) {
    try {
      // @ts-ignore
      const partner = await this.service.toggleAvailability(req.user!.userId);
      sendSuccess(res, 'Availability toggled', { partner });
    } catch (e) {
      next(e);
    }
  }

  async updateLocation(req: Request, res: Response, next: NextFunction) {
    try {
      const input = updateLocationSchema.parse(req.body);
      // @ts-ignore
      await this.service.updateLocation(req.user!.userId, input.latitude, input.longitude);
      sendSuccess(res, 'Location updated');
    } catch (e) {
      next(e);
    }
  }

  async getDeliveryByOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const delivery = await this.service.getDeliveryByOrder(req.params.orderId);
      sendSuccess(res, 'Delivery details', { delivery });
    } catch (e) {
      next(e);
    }
  }

  async updateDeliveryStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const input = updateDeliveryStatusSchema.parse(req.body);
      // @ts-ignore
      const delivery = await this.service.updateDeliveryStatus(req.user!.userId, req.params.orderId, input.status);
      sendSuccess(res, 'Delivery status updated', { delivery });
    } catch (e) {
      next(e);
    }
  }

  async getMyDeliveries(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      // @ts-ignore
      const result = await this.service.getMyDeliveries(req.user!.userId, page, limit);
      sendSuccess(res, 'My deliveries', result);
    } catch (e) {
      next(e);
    }
  }

  async getMyEarnings(req: Request, res: Response, next: NextFunction) {
    try {
      // @ts-ignore
      const earnings = await this.service.getMyEarnings(req.user!.userId);
      sendSuccess(res, 'Earnings summary', earnings);
    } catch (e) {
      next(e);
    }
  }
}
