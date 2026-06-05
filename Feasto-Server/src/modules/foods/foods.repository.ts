// src/modules/foods/foods.repository.ts
import { prisma } from '../../shared/utils/prisma';
import { CreateFoodInput, UpdateFoodInput, CreateVariantInput, CreateAddonInput } from './foods.validator';

export class FoodsRepository {
  async findAllByRestaurant(restaurantId: string, options?: { isAvailable?: boolean }) {
    return prisma.food.findMany({
      where: { restaurantId, ...options },
      include: {
        variants: true,
        addons: true,
        images: true,
        category: true
      }
    });
  }

  async findById(id: string) {
    return prisma.food.findUnique({
      where: { id },
      include: {
        variants: true,
        addons: true,
        images: true,
        restaurant: { select: { ownerId: true } }
      }
    });
  }

  async create(data: CreateFoodInput) {
    return prisma.food.create({
      data
    });
  }

  async update(id: string, data: UpdateFoodInput) {
    return prisma.food.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    return prisma.food.delete({
      where: { id }
    });
  }

  async addVariant(foodId: string, data: CreateVariantInput) {
    return prisma.foodVariant.create({
      data: {
        ...data,
        foodId
      }
    });
  }

  async removeVariant(variantId: string) {
    return prisma.foodVariant.delete({ where: { id: variantId } });
  }

  async addAddon(foodId: string, data: CreateAddonInput) {
    return prisma.foodAddon.create({
      data: {
        ...data,
        foodId
      }
    });
  }

  async removeAddon(addonId: string) {
    return prisma.foodAddon.delete({ where: { id: addonId } });
  }
}
