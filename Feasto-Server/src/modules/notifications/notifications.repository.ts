// src/modules/notifications/notifications.repository.ts
import { prisma } from '../../shared/utils/prisma';

export class NotificationsRepository {

  async create(userId: string, title: string, body: string, type: string) {
    return prisma.notification.create({
      data: { userId, title, body, type },
    });
  }

  async findByUser(userId: string, page = 1, limit = 20) {
    const where = { userId };
    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId, isRead: false } }),
    ]);
    return { notifications, total, unreadCount, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async markAsRead(notificationId: string) {
    return prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async delete(notificationId: string) {
    return prisma.notification.delete({ where: { id: notificationId } });
  }
}
