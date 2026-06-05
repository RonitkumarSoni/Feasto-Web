// src/modules/orders/orders.service.ts
import { OrdersRepository } from './orders.repository';
import { CreateOrderInput } from './orders.validator';
import { AppError } from '../../shared/middleware/errorHandler';
import { prisma } from '../../shared/utils/prisma';

// Valid order status transitions (state machine)
const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING: ['ACCEPTED', 'CANCELLED'],
  ACCEPTED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY_FOR_PICKUP', 'CANCELLED'],
  READY_FOR_PICKUP: ['PICKED_UP'],
  PICKED_UP: ['ON_THE_WAY'],
  ON_THE_WAY: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};

export class OrdersService {
  private repository: OrdersRepository;

  constructor() {
    this.repository = new OrdersRepository();
  }

  async createOrder(userId: string, input: CreateOrderInput) {
    // 1. Fetch all food items with their variants and addons
    const foodIds = input.items.map(i => i.foodId);
    const foods = await prisma.food.findMany({
      where: { id: { in: foodIds }, restaurantId: input.restaurantId },
      include: { variants: true, addons: true },
    });

    if (foods.length !== new Set(foodIds).size) {
      throw new AppError('One or more food items not found in this restaurant', 400);
    }

    // 2. Calculate prices
    let itemTotal = 0;
    const orderItems: Array<{
      foodId: string;
      variantId?: string;
      addonId?: string;
      quantity: number;
      price: number;
    }> = [];

    for (const item of input.items) {
      const food = foods.find(f => f.id === item.foodId);
      if (!food) throw new AppError(`Food item ${item.foodId} not found`, 400);

      let unitPrice = food.basePrice;

      if (item.variantId) {
        const variant = food.variants.find(v => v.id === item.variantId);
        if (!variant) throw new AppError(`Variant ${item.variantId} not found`, 400);
        unitPrice += variant.price;
      }

      if (item.addonId) {
        const addon = food.addons.find(a => a.id === item.addonId);
        if (!addon) throw new AppError(`Addon ${item.addonId} not found`, 400);
        unitPrice += addon.price;
      }

      const lineTotal = unitPrice * item.quantity;
      itemTotal += lineTotal;

      orderItems.push({
        foodId: item.foodId,
        variantId: item.variantId,
        addonId: item.addonId,
        quantity: item.quantity,
        price: lineTotal,
      });
    }

    // 3. Get restaurant tax rate
    const restaurant = await this.repository.getRestaurantOwner(input.restaurantId);
    if (!restaurant) throw new AppError('Restaurant not found', 404);

    if (restaurant.minOrderValue && itemTotal < restaurant.minOrderValue) {
      throw new AppError(`Minimum order value is ₹${restaurant.minOrderValue}`, 400);
    }

    const taxRate = restaurant.taxRate || 5;
    const taxAmount = Math.round(itemTotal * (taxRate / 100) * 100) / 100;
    const deliveryFee = 50; // Fixed for now
    const discountAmount = 0; // Will be calculated with coupon
    const totalAmount = itemTotal + taxAmount + deliveryFee - discountAmount;

    // 4. Create order
    const order = await this.repository.create(userId, {
      restaurantId: input.restaurantId,
      deliveryAddressId: input.deliveryAddressId,
      itemTotal,
      taxAmount,
      deliveryFee,
      discountAmount,
      totalAmount,
      specialInstructions: input.specialInstructions,
      items: orderItems,
    });

    // 5. Create payment record
    await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: totalAmount,
        method: input.paymentMethod as any,
        status: input.paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
      },
    });

    // 6. Clear user's cart after successful order
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    return this.repository.findById(order.id);
  }

  async getOrderById(orderId: string, userId: string, userRole: string) {
    const order = await this.repository.findById(orderId);
    if (!order) throw new AppError('Order not found', 404);

    // Authorization: customer sees own orders, restaurant owner sees restaurant orders
    if (userRole === 'CUSTOMER' && order.userId !== userId) {
      throw new AppError('Not authorized to view this order', 403);
    }

    if (userRole === 'RESTAURANT_OWNER') {
      const restaurant = await this.repository.getRestaurantOwner(order.restaurantId);
      if (!restaurant || restaurant.ownerId !== userId) {
        throw new AppError('Not authorized to view this order', 403);
      }
    }

    return order;
  }

  async getMyOrders(userId: string, status?: string, page = 1, limit = 10) {
    return this.repository.findByUser(userId, status, page, limit);
  }

  async getRestaurantOrders(userId: string, restaurantId: string, status?: string, page = 1, limit = 10) {
    // Verify ownership
    const restaurant = await this.repository.getRestaurantOwner(restaurantId);
    if (!restaurant || restaurant.ownerId !== userId) {
      throw new AppError('Not authorized to view restaurant orders', 403);
    }

    return this.repository.findByRestaurant(restaurantId, status, page, limit);
  }

  async updateOrderStatus(orderId: string, newStatus: string, userId: string, userRole: string) {
    const order = await this.repository.findById(orderId);
    if (!order) throw new AppError('Order not found', 404);

    // Authorization
    if (userRole === 'RESTAURANT_OWNER') {
      const restaurant = await this.repository.getRestaurantOwner(order.restaurantId);
      if (!restaurant || restaurant.ownerId !== userId) {
        throw new AppError('Not authorized', 403);
      }
    }

    // Customer can only cancel
    if (userRole === 'CUSTOMER') {
      if (order.userId !== userId) throw new AppError('Not authorized', 403);
      if (newStatus !== 'CANCELLED') throw new AppError('Customers can only cancel orders', 400);
      if (!['PENDING', 'ACCEPTED'].includes(order.status)) {
        throw new AppError('Order can no longer be cancelled', 400);
      }
    }

    // Validate state machine transition
    const allowedTransitions = VALID_TRANSITIONS[order.status] || [];
    if (!allowedTransitions.includes(newStatus)) {
      throw new AppError(`Cannot transition from ${order.status} to ${newStatus}`, 400);
    }

    return this.repository.updateStatus(orderId, newStatus);
  }

  async reorder(userId: string, orderId: string) {
    const order = await this.repository.findById(orderId);
    if (!order) throw new AppError('Order not found', 404);
    if (order.userId !== userId) throw new AppError('Not authorized', 403);

    // Re-create the order with the same items
    const input: CreateOrderInput = {
      restaurantId: order.restaurantId,
      deliveryAddressId: order.deliveryAddressId,
      paymentMethod: 'COD',
      items: order.items.map(item => ({
        foodId: item.foodId,
        variantId: item.variantId || undefined,
        addonId: item.addonId || undefined,
        quantity: item.quantity,
      })),
    };

    return this.createOrder(userId, input);
  }
}
