// src/modules/orders/orders.controller.ts
import { Request, Response, NextFunction } from 'express';
import { OrdersService } from './orders.service';
import { createOrderSchema, updateOrderStatusSchema, orderQuerySchema } from './orders.validator';
import { sendSuccess } from '../../shared/utils/apiResponse';

export class OrdersController {
  private service: OrdersService;

  constructor() {
    this.service = new OrdersService();
    this.createOrder = this.createOrder.bind(this);
    this.getOrder = this.getOrder.bind(this);
    this.getMyOrders = this.getMyOrders.bind(this);
    this.getRestaurantOrders = this.getRestaurantOrders.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.reorder = this.reorder.bind(this);
  }

  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const input = createOrderSchema.parse(req.body);
      // @ts-ignore
      const order = await this.service.createOrder(req.user!.userId, input);
      sendSuccess(res, 'Order placed successfully', { order }, 201);
    } catch (e) {
      next(e);
    }
  }

  async getOrder(req: Request, res: Response, next: NextFunction) {
    try {
      // @ts-ignore
      const order = await this.service.getOrderById(req.params.id, req.user!.userId, req.user!.role);
      sendSuccess(res, 'Order fetched', { order });
    } catch (e) {
      next(e);
    }
  }

  async getMyOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const query = orderQuerySchema.parse(req.query);
      // @ts-ignore
      const result = await this.service.getMyOrders(req.user!.userId, query.status, query.page, query.limit);
      sendSuccess(res, 'Orders fetched', result);
    } catch (e) {
      next(e);
    }
  }

  async getRestaurantOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const query = orderQuerySchema.parse(req.query);
      // @ts-ignore
      const result = await this.service.getRestaurantOrders(req.user!.userId, req.params.restaurantId, query.status, query.page, query.limit);
      sendSuccess(res, 'Restaurant orders fetched', result);
    } catch (e) {
      next(e);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const input = updateOrderStatusSchema.parse(req.body);
      // @ts-ignore
      const order = await this.service.updateOrderStatus(req.params.id, input.status, req.user!.userId, req.user!.role);
      sendSuccess(res, 'Order status updated', { order });
    } catch (e) {
      next(e);
    }
  }

  async reorder(req: Request, res: Response, next: NextFunction) {
    try {
      // @ts-ignore
      const order = await this.service.reorder(req.user!.userId, req.params.id);
      sendSuccess(res, 'Reorder placed successfully', { order }, 201);
    } catch (e) {
      next(e);
    }
  }
}
