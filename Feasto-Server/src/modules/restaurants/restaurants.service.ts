// src/modules/restaurants/restaurants.service.ts
import { RestaurantsRepository } from './restaurants.repository';
import { CreateRestaurantInput, UpdateRestaurantInput } from './restaurants.validator';
import { AppError } from '../../shared/middleware/errorHandler';

export class RestaurantsService {
  private repository: RestaurantsRepository;

  constructor() {
    this.repository = new RestaurantsRepository();
  }

  async getAllRestaurants(onlyActive = true) {
    return this.repository.findAll(onlyActive ? { isActive: true, isApproved: true } : undefined);
  }

  async getRestaurantById(id: string) {
    const restaurant = await this.repository.findById(id);
    if (!restaurant) {
      throw new AppError('Restaurant not found', 404);
    }
    return restaurant;
  }

  async createRestaurant(ownerId: string, data: CreateRestaurantInput) {
    return this.repository.create(ownerId, data);
  }

  async updateRestaurant(id: string, ownerId: string, data: UpdateRestaurantInput) {
    const restaurant = await this.repository.findById(id);
    if (!restaurant) {
      throw new AppError('Restaurant not found', 404);
    }
    
    // Check ownership or admin status could be done here or in controller
    if (restaurant.ownerId !== ownerId) {
       throw new AppError('Unauthorized', 403);
    }

    return this.repository.update(id, data);
  }

  async deleteRestaurant(id: string, ownerId: string) {
    const restaurant = await this.repository.findById(id);
    if (!restaurant) {
      throw new AppError('Restaurant not found', 404);
    }
    
    if (restaurant.ownerId !== ownerId) {
       throw new AppError('Unauthorized', 403);
    }

    return this.repository.delete(id);
  }
}
