// src/modules/restaurants/restaurants.controller.ts
import { Request, Response, NextFunction } from 'express';
import { RestaurantsService } from './restaurants.service';
import { createRestaurantSchema, updateRestaurantSchema } from './restaurants.validator';
import { sendSuccess } from '../../shared/utils/apiResponse';

export class RestaurantsController {
  private service: RestaurantsService;

  constructor() {
    this.service = new RestaurantsService();
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurants = await this.service.getAllRestaurants();
      sendSuccess(res, 'Restaurants fetched successfully', { restaurants });
    } catch (e) {
      next(e);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurant = await this.service.getRestaurantById(req.params.id);
      sendSuccess(res, 'Restaurant fetched successfully', { restaurant });
    } catch (e) {
      next(e);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const input = createRestaurantSchema.parse(req.body);
      // @ts-ignore
      const restaurant = await this.service.createRestaurant(req.user!.userId, input);
      sendSuccess(res, 'Restaurant created successfully', { restaurant }, 201);
    } catch (e) {
      next(e);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const input = updateRestaurantSchema.parse(req.body);
      // @ts-ignore
      const restaurant = await this.service.updateRestaurant(req.params.id, req.user!.userId, input);
      sendSuccess(res, 'Restaurant updated successfully', { restaurant });
    } catch (e) {
      next(e);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      // @ts-ignore
      await this.service.deleteRestaurant(req.params.id, req.user!.userId);
      sendSuccess(res, 'Restaurant deleted successfully');
    } catch (e) {
      next(e);
    }
  }
}
