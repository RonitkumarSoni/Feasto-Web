// src/modules/foods/foods.controller.ts
import { Request, Response, NextFunction } from 'express';
import { FoodsService } from './foods.service';
import { createFoodSchema, updateFoodSchema, createVariantSchema, createAddonSchema } from './foods.validator';
import { sendSuccess } from '../../shared/utils/apiResponse';

export class FoodsController {
  private service: FoodsService;

  constructor() {
    this.service = new FoodsService();
    this.getByRestaurant = this.getByRestaurant.bind(this);
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.addVariant = this.addVariant.bind(this);
    this.addAddon = this.addAddon.bind(this);
  }

  async getByRestaurant(req: Request, res: Response, next: NextFunction) {
    try {
      const foods = await this.service.getFoodsByRestaurant(req.params.restaurantId);
      sendSuccess(res, 'Foods fetched successfully', { foods });
    } catch (e) {
      next(e);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const food = await this.service.getFoodById(req.params.id);
      sendSuccess(res, 'Food item fetched successfully', { food });
    } catch (e) {
      next(e);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const input = createFoodSchema.parse(req.body);
      // @ts-ignore
      const food = await this.service.createFood(req.user!.userId, input);
      sendSuccess(res, 'Food created successfully', { food }, 201);
    } catch (e) {
      next(e);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const input = updateFoodSchema.parse(req.body);
      // @ts-ignore
      const food = await this.service.updateFood(req.params.id, req.user!.userId, input);
      sendSuccess(res, 'Food updated successfully', { food });
    } catch (e) {
      next(e);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      // @ts-ignore
      await this.service.deleteFood(req.params.id, req.user!.userId);
      sendSuccess(res, 'Food deleted successfully');
    } catch (e) {
      next(e);
    }
  }

  async addVariant(req: Request, res: Response, next: NextFunction) {
    try {
      const input = createVariantSchema.parse(req.body);
      // @ts-ignore
      const variant = await this.service.addVariant(req.params.id, req.user!.userId, input);
      sendSuccess(res, 'Variant added successfully', { variant }, 201);
    } catch (e) {
      next(e);
    }
  }

  async addAddon(req: Request, res: Response, next: NextFunction) {
    try {
      const input = createAddonSchema.parse(req.body);
      // @ts-ignore
      const addon = await this.service.addAddon(req.params.id, req.user!.userId, input);
      sendSuccess(res, 'Addon added successfully', { addon }, 201);
    } catch (e) {
      next(e);
    }
  }
}
