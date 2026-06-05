// src/modules/reviews/reviews.service.ts
import { ReviewsRepository } from './reviews.repository';
import { CreateReviewInput } from './reviews.validator';
import { AppError } from '../../shared/middleware/errorHandler';

export class ReviewsService {
  private repository: ReviewsRepository;

  constructor() {
    this.repository = new ReviewsRepository();
  }

  async create(userId: string, input: CreateReviewInput) {
    return this.repository.create(userId, input);
  }

  async getByRestaurant(restaurantId: string, page = 1, limit = 10) {
    return this.repository.findByRestaurant(restaurantId, page, limit);
  }

  async getByFood(foodId: string, page = 1, limit = 10) {
    return this.repository.findByFood(foodId, page, limit);
  }

  async getAverageRating(restaurantId: string) {
    return this.repository.getAverageRating(restaurantId);
  }

  async delete(userId: string, reviewId: string, userRole: string) {
    const review = await this.repository.findById(reviewId);
    if (!review) throw new AppError('Review not found', 404);
    if (review.userId !== userId && userRole !== 'ADMIN') {
      throw new AppError('Not authorized to delete this review', 403);
    }
    return this.repository.delete(reviewId);
  }
}
