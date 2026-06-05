// src/modules/delivery/delivery.repository.ts
import { prisma } from '../../shared/utils/prisma';

export class DeliveryRepository {

  async registerPartner(userId: string, vehicleType: string, vehicleNumber: string) {
    return prisma.deliveryPartner.create({
      data: { userId, vehicleType, vehicleNumber },
      include: { user: { select: { id: true, name: true, phone: true, email: true } } },
    });
  }

  async getPartnerByUserId(userId: string) {
    return prisma.deliveryPartner.findUnique({
      where: { userId },
      include: { user: { select: { id: true, name: true, phone: true } } },
    });
  }

  async updateAvailability(partnerId: string, isAvailable: boolean) {
    return prisma.deliveryPartner.update({
      where: { id: partnerId },
      data: { isAvailable },
    });
  }

  async updateLocation(partnerId: string, latitude: number, longitude: number) {
    await prisma.deliveryPartner.update({
      where: { id: partnerId },
      data: { currentLatitude: latitude, currentLongitude: longitude },
    });

    return prisma.deliveryLocation.create({
      data: { deliveryPartnerId: partnerId, latitude, longitude },
    });
  }

  async assignDelivery(orderId: string, partnerId: string, earnings: number) {
    return prisma.delivery.create({
      data: {
        orderId,
        deliveryPartnerId: partnerId,
        earnings,
      },
      include: {
        order: { select: { id: true, status: true, totalAmount: true } },
        partner: { include: { user: { select: { name: true, phone: true } } } },
      },
    });
  }

  async getDeliveryByOrder(orderId: string) {
    return prisma.delivery.findUnique({
      where: { orderId },
      include: {
        order: { include: { address: true, restaurant: { select: { name: true, address: true } } } },
        partner: { include: { user: { select: { name: true, phone: true } } } },
      },
    });
  }

  async updateDeliveryStatus(orderId: string, status: string) {
    const data: any = { status };
    if (status === 'PICKED_UP') data.pickupTime = new Date();
    if (status === 'DELIVERED') data.dropoffTime = new Date();

    return prisma.delivery.update({
      where: { orderId },
      data,
    });
  }

  async getPartnerDeliveries(partnerId: string, page = 1, limit = 10) {
    const where = { deliveryPartnerId: partnerId };

    const [deliveries, total] = await Promise.all([
      prisma.delivery.findMany({
        where,
        include: {
          order: {
            select: { id: true, status: true, totalAmount: true, createdAt: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.delivery.count({ where }),
    ]);

    return { deliveries, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getPartnerEarnings(partnerId: string) {
    const result = await prisma.delivery.aggregate({
      where: { deliveryPartnerId: partnerId, status: 'DELIVERED' },
      _sum: { earnings: true },
      _count: true,
    });

    return {
      totalEarnings: result._sum.earnings || 0,
      totalDeliveries: result._count,
    };
  }

  async findAvailablePartners() {
    return prisma.deliveryPartner.findMany({
      where: { isAvailable: true },
      include: { user: { select: { name: true, phone: true } } },
    });
  }
}
