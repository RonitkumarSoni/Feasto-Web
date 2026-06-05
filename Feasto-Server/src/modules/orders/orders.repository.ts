// src/modules/orders/orders.repository.ts
import { prisma } from '../../shared/utils/prisma';
import { CreateOrderInput } from './orders.validator';

const orderInclude = {
  items: {
    include: {
      food: { select: { id: true, name: true, basePrice: true, isVeg: true } },
      variant: { select: { id: true, name: true, price: true } },
      addon: { select: { id: true, name: true, price: true } },
    },
  },
  restaurant: { select: { id: true, name: true, logoUrl: true, contactPhone: true } },
  address: true,
  payment: true,
  delivery: {
    include: {
      partner: {
        include: { user: { select: { name: true, phone: true } } },
      },
    },
  },
};

export class OrdersRepository {

  async create(userId: string, data: {
    restaurantId: string;
    deliveryAddressId: string;
    itemTotal: number;
    taxAmount: number;
    deliveryFee: number;
    discountAmount: number;
    totalAmount: number;
    specialInstructions?: string;
    items: Array<{
      foodId: string;
      variantId?: string;
      addonId?: string;
      quantity: number;
      price: number;
    }>;
  }) {
    return prisma.order.create({
      data: {
        userId,
        restaurantId: data.restaurantId,
        deliveryAddressId: data.deliveryAddressId,
        itemTotal: data.itemTotal,
        taxAmount: data.taxAmount,
        deliveryFee: data.deliveryFee,
        discountAmount: data.discountAmount,
        totalAmount: data.totalAmount,
        specialInstructions: data.specialInstructions,
        items: {
          create: data.items.map(item => ({
            foodId: item.foodId,
            variantId: item.variantId,
            addonId: item.addonId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: orderInclude,
    });
  }

  async findById(orderId: string) {
    return prisma.order.findUnique({
      where: { id: orderId },
      include: orderInclude,
    });
  }

  async findByUser(userId: string, status?: string, page = 1, limit = 10) {
    const where: any = { userId };
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: orderInclude,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findByRestaurant(restaurantId: string, status?: string, page = 1, limit = 10) {
    const where: any = { restaurantId };
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: orderInclude,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateStatus(orderId: string, status: string) {
    return prisma.order.update({
      where: { id: orderId },
      data: { status: status as any },
      include: orderInclude,
    });
  }

  async getRestaurantOwner(restaurantId: string) {
    return prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: { ownerId: true, taxRate: true, minOrderValue: true },
    });
  }
}
