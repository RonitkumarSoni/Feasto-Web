// src/modules/restaurants/restaurants.repository.ts
import { prisma } from '../../shared/utils/prisma';
import { CreateRestaurantInput, UpdateRestaurantInput } from './restaurants.validator';

export class RestaurantsRepository {
  async findAll(options?: { isActive?: boolean; isApproved?: boolean }) {
    return prisma.restaurant.findMany({
      where: options,
      include: {
        categories: true,
        images: true
      }
    });
  }

  async findById(id: string) {
    return prisma.restaurant.findUnique({
      where: { id },
      include: {
        categories: true,
        images: true,
        foods: {
          include: {
            variants: true,
            addons: true,
            images: true
          }
        }
      }
    });
  }

  async create(ownerId: string, data: CreateRestaurantInput) {
    return prisma.restaurant.create({
      data: {
        ...data,
        ownerId
      }
    });
  }

  async update(id: string, data: UpdateRestaurantInput) {
    return prisma.restaurant.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    return prisma.restaurant.delete({
      where: { id }
    });
  }
}
