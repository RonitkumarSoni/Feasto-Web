// src/modules/foods/foods.service.ts
import { FoodsRepository } from './foods.repository';
import { CreateFoodInput, UpdateFoodInput, CreateVariantInput, CreateAddonInput } from './foods.validator';
import { AppError } from '../../shared/middleware/errorHandler';

export class FoodsService {
  private repository: FoodsRepository;

  constructor() {
    this.repository = new FoodsRepository();
  }

  async getFoodsByRestaurant(restaurantId: string, onlyAvailable = true) {
    return this.repository.findAllByRestaurant(restaurantId, onlyAvailable ? { isAvailable: true } : undefined);
  }

  async getFoodById(id: string) {
    const food = await this.repository.findById(id);
    if (!food) {
      throw new AppError('Food item not found', 404);
    }
    return food;
  }

  async createFood(ownerId: string, data: CreateFoodInput) {
    // In a real app, verify that ownerId owns the restaurantId
    return this.repository.create(data);
  }

  async updateFood(id: string, ownerId: string, data: UpdateFoodInput) {
    const food = await this.getFoodById(id);
    if (food.restaurant?.ownerId !== ownerId) {
       throw new AppError('Unauthorized', 403);
    }
    return this.repository.update(id, data);
  }

  async deleteFood(id: string, ownerId: string) {
    const food = await this.getFoodById(id);
    if (food.restaurant?.ownerId !== ownerId) {
       throw new AppError('Unauthorized', 403);
    }
    return this.repository.delete(id);
  }

  async addVariant(foodId: string, ownerId: string, data: CreateVariantInput) {
    const food = await this.getFoodById(foodId);
    if (food.restaurant?.ownerId !== ownerId) throw new AppError('Unauthorized', 403);
    return this.repository.addVariant(foodId, data);
  }

  async addAddon(foodId: string, ownerId: string, data: CreateAddonInput) {
    const food = await this.getFoodById(foodId);
    if (food.restaurant?.ownerId !== ownerId) throw new AppError('Unauthorized', 403);
    return this.repository.addAddon(foodId, data);
  }
}
