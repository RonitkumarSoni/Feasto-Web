// src/modules/reviews/reviews.repository.ts
import { prisma } from '../../shared/utils/prisma';

export class ReviewsRepository {

  async create(userId: string, data: { restaurantId?: string; foodId?: string; rating: number; comment?: string }) {
    return prisma.review.create({
      data: {
        userId,
        restaurantId: data.restaurantId,
        foodId: data.foodId,
        rating: data.rating,
        comment: data.comment,
      },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
  }

  async findByRestaurant(restaurantId: string, page = 1, limit = 10) {
    const where = { restaurantId };
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: { user: { select: { id: true, name: true, avatarUrl: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.review.count({ where }),
    ]);
    return { reviews, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findByFood(foodId: string, page = 1, limit = 10) {
    const where = { foodId };
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: { user: { select: { id: true, name: true, avatarUrl: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.review.count({ where }),
    ]);
    return { reviews, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getAverageRating(restaurantId: string) {
    const result = await prisma.review.aggregate({
      where: { restaurantId },
      _avg: { rating: true },
      _count: true,
    });
    return { averageRating: result._avg.rating || 0, totalReviews: result._count };
  }

  async delete(reviewId: string) {
    return prisma.review.delete({ where: { id: reviewId } });
  }

  async findById(reviewId: string) {
    return prisma.review.findUnique({ where: { id: reviewId } });
  }
}
