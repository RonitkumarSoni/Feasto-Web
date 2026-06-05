// src/modules/reviews/reviews.controller.ts
import { Request, Response, NextFunction } from 'express';
import { ReviewsService } from './reviews.service';
import { createReviewSchema } from './reviews.validator';
import { sendSuccess } from '../../shared/utils/apiResponse';

export class ReviewsController {
  private service: ReviewsService;

  constructor() {
    this.service = new ReviewsService();
    this.create = this.create.bind(this);
    this.getByRestaurant = this.getByRestaurant.bind(this);
    this.getByFood = this.getByFood.bind(this);
    this.getRating = this.getRating.bind(this);
    this.remove = this.remove.bind(this);
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const input = createReviewSchema.parse(req.body);
      // @ts-ignore
      const review = await this.service.create(req.user!.userId, input);
      sendSuccess(res, 'Review submitted', { review }, 201);
    } catch (e) {
      next(e);
    }
  }

  async getByRestaurant(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this.service.getByRestaurant(req.params.restaurantId, page, limit);
      sendSuccess(res, 'Reviews fetched', result);
    } catch (e) {
      next(e);
    }
  }

  async getByFood(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this.service.getByFood(req.params.foodId, page, limit);
      sendSuccess(res, 'Reviews fetched', result);
    } catch (e) {
      next(e);
    }
  }

  async getRating(req: Request, res: Response, next: NextFunction) {
    try {
      const rating = await this.service.getAverageRating(req.params.restaurantId);
      sendSuccess(res, 'Average rating', rating);
    } catch (e) {
      next(e);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      // @ts-ignore
      await this.service.delete(req.user!.userId, req.params.id, req.user!.role);
      sendSuccess(res, 'Review deleted');
    } catch (e) {
      next(e);
    }
  }
}
