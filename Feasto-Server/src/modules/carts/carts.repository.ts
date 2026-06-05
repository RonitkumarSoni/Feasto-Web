// src/modules/carts/carts.repository.ts
import { prisma } from '../../shared/utils/prisma';
import { AddCartItemInput, UpdateCartItemInput } from './carts.validator';

export class CartsRepository {
  async getCart(userId: string) {
    return prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
      include: {
        items: {
          include: {
            food: true,
            variant: true,
            addon: true
          }
        }
      }
    });
  }

  async addItem(cartId: string, data: AddCartItemInput) {
    // Check if item already exists
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId,
        foodId: data.foodId,
        variantId: data.variantId || null,
        addonId: data.addonId || null
      }
    });

    if (existingItem) {
      return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + data.quantity }
      });
    }

    return prisma.cartItem.create({
      data: {
        cartId,
        foodId: data.foodId,
        variantId: data.variantId,
        addonId: data.addonId,
        quantity: data.quantity
      }
    });
  }

  async updateItem(itemId: string, data: UpdateCartItemInput) {
    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: data.quantity }
    });
  }

  async removeItem(itemId: string) {
    return prisma.cartItem.delete({
      where: { id: itemId }
    });
  }

  async clearCart(cartId: string) {
    return prisma.cartItem.deleteMany({
      where: { cartId }
    });
  }
}
