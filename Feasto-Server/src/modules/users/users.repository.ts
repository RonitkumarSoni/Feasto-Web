// src/modules/users/users.repository.ts
import { prisma } from '../../shared/utils/prisma';
import { UpdateProfileInput, CreateAddressInput, UpdateAddressInput } from './users.validator';

export class UsersRepository {
  async findById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, phone: true, name: true, role: true, avatarUrl: true, createdAt: true
      }
    });
  }

  async updateProfile(userId: string, data: UpdateProfileInput) {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true, email: true, phone: true, name: true, role: true, avatarUrl: true, createdAt: true
      }
    });
  }

  // Address Methods
  async findAddressesByUserId(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' }
    });
  }

  async createAddress(userId: string, data: CreateAddressInput) {
    if (data.isDefault) {
      await this.removeDefaultAddresses(userId);
    }
    return prisma.address.create({
      data: {
        ...data,
        userId
      }
    });
  }

  async updateAddress(addressId: string, userId: string, data: UpdateAddressInput) {
    if (data.isDefault) {
      await this.removeDefaultAddresses(userId);
    }
    return prisma.address.update({
      where: { id: addressId, userId },
      data
    });
  }

  async deleteAddress(addressId: string, userId: string) {
    return prisma.address.delete({
      where: { id: addressId, userId }
    });
  }

  private async removeDefaultAddresses(userId: string) {
    return prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false }
    });
  }
}
