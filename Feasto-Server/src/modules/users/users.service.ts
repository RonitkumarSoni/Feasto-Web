// src/modules/users/users.service.ts
import { UsersRepository } from './users.repository';
import { UpdateProfileInput, CreateAddressInput, UpdateAddressInput } from './users.validator';
import { AppError } from '../../shared/middleware/errorHandler';

export class UsersService {
  private repository: UsersRepository;

  constructor() {
    this.repository = new UsersRepository();
  }

  async getProfile(userId: string) {
    const user = await this.repository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  async updateProfile(userId: string, data: UpdateProfileInput) {
    return this.repository.updateProfile(userId, data);
  }

  async getAddresses(userId: string) {
    return this.repository.findAddressesByUserId(userId);
  }

  async addAddress(userId: string, data: CreateAddressInput) {
    return this.repository.createAddress(userId, data);
  }

  async updateAddress(addressId: string, userId: string, data: UpdateAddressInput) {
    try {
      return await this.repository.updateAddress(addressId, userId, data);
    } catch {
      throw new AppError('Address not found or unauthorized', 404);
    }
  }

  async deleteAddress(addressId: string, userId: string) {
    try {
      await this.repository.deleteAddress(addressId, userId);
    } catch {
      throw new AppError('Address not found or unauthorized', 404);
    }
  }
}
