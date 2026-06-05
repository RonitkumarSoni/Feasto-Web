// src/modules/carts/carts.controller.ts
import { Request, Response, NextFunction } from 'express';
import { CartsService } from './carts.service';
import { addCartItemSchema, updateCartItemSchema } from './carts.validator';
import { sendSuccess } from '../../shared/utils/apiResponse';

export class CartsController {
  private service: CartsService;

  constructor() {
    this.service = new CartsService();
    this.getCart = this.getCart.bind(this);
    this.addItem = this.addItem.bind(this);
    this.updateItem = this.updateItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.clearCart = this.clearCart.bind(this);
  }

  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      // @ts-ignore
      const cart = await this.service.getCart(req.user!.userId);
      sendSuccess(res, 'Cart fetched successfully', { cart });
    } catch (e) {
      next(e);
    }
  }

  async addItem(req: Request, res: Response, next: NextFunction) {
    try {
      const input = addCartItemSchema.parse(req.body);
      // @ts-ignore
      const item = await this.service.addItem(req.user!.userId, input);
      sendSuccess(res, 'Item added to cart', { item }, 201);
    } catch (e) {
      next(e);
    }
  }

  async updateItem(req: Request, res: Response, next: NextFunction) {
    try {
      const input = updateCartItemSchema.parse(req.body);
      // @ts-ignore
      const item = await this.service.updateItem(req.user!.userId, req.params.itemId, input);
      sendSuccess(res, 'Cart item updated', { item });
    } catch (e) {
      next(e);
    }
  }

  async removeItem(req: Request, res: Response, next: NextFunction) {
    try {
      // @ts-ignore
      await this.service.removeItem(req.user!.userId, req.params.itemId);
      sendSuccess(res, 'Item removed from cart');
    } catch (e) {
      next(e);
    }
  }

  async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      // @ts-ignore
      await this.service.clearCart(req.user!.userId);
      sendSuccess(res, 'Cart cleared successfully');
    } catch (e) {
      next(e);
    }
  }
}
