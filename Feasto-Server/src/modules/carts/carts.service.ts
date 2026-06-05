// src/modules/carts/carts.service.ts
import { CartsRepository } from './carts.repository';
import { AddCartItemInput, UpdateCartItemInput } from './carts.validator';
import { AppError } from '../../shared/middleware/errorHandler';

export class CartsService {
  private repository: CartsRepository;

  constructor() {
    this.repository = new CartsRepository();
  }

  async getCart(userId: string) {
    const cart = await this.repository.getCart(userId);
    
    // Calculate totals
    let itemTotal = 0;
    
    cart.items.forEach(item => {
      let price = item.food.basePrice;
      if (item.variant) price += item.variant.price;
      if (item.addon) price += item.addon.price;
      itemTotal += price * item.quantity;
    });

    const taxAmount = itemTotal * 0.05; // 5% default tax
    const deliveryFee = itemTotal > 0 ? 50 : 0; // Default 50 delivery fee
    const totalAmount = itemTotal + taxAmount + deliveryFee;

    return {
      ...cart,
      summary: {
        itemTotal,
        taxAmount,
        deliveryFee,
        totalAmount
      }
    };
  }

  async addItem(userId: string, data: AddCartItemInput) {
    const cart = await this.repository.getCart(userId);
    return this.repository.addItem(cart.id, data);
  }

  async updateItem(userId: string, itemId: string, data: UpdateCartItemInput) {
    // Check if item belongs to user cart could be done here
    return this.repository.updateItem(itemId, data);
  }

  async removeItem(userId: string, itemId: string) {
    return this.repository.removeItem(itemId);
  }

  async clearCart(userId: string) {
    const cart = await this.repository.getCart(userId);
    return this.repository.clearCart(cart.id);
  }
}
