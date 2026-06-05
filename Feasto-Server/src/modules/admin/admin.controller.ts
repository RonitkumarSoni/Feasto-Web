// src/modules/admin/admin.controller.ts
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../shared/utils/prisma';
import { sendSuccess } from '../../shared/utils/apiResponse';
import { AppError } from '../../shared/middleware/errorHandler';

export class AdminController {

  constructor() {
    this.getDashboard = this.getDashboard.bind(this);
    this.getAllUsers = this.getAllUsers.bind(this);
    this.getAllRestaurants = this.getAllRestaurants.bind(this);
    this.approveRestaurant = this.approveRestaurant.bind(this);
    this.getAllOrders = this.getAllOrders.bind(this);
    this.getAuditLogs = this.getAuditLogs.bind(this);
  }

  async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const [
        totalUsers,
        totalRestaurants,
        totalOrders,
        totalRevenue,
        pendingApprovals,
        activeDeliveryPartners,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.restaurant.count(),
        prisma.order.count(),
        prisma.order.aggregate({ where: { status: 'DELIVERED' }, _sum: { totalAmount: true } }),
        prisma.restaurant.count({ where: { isApproved: false } }),
        prisma.deliveryPartner.count({ where: { isAvailable: true } }),
      ]);

      sendSuccess(res, 'Admin dashboard', {
        totalUsers,
        totalRestaurants,
        totalOrders,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        pendingApprovals,
        activeDeliveryPartners,
      });
    } catch (e) {
      next(e);
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const role = req.query.role as string | undefined;

      const where: any = {};
      if (role) where.role = role;

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          select: { id: true, name: true, email: true, phone: true, role: true, isVerified: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.user.count({ where }),
      ]);

      sendSuccess(res, 'Users list', { users, total, page, limit, totalPages: Math.ceil(total / limit) });
    } catch (e) {
      next(e);
    }
  }

  async getAllRestaurants(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const [restaurants, total] = await Promise.all([
        prisma.restaurant.findMany({
          include: { owner: { select: { name: true, email: true } } },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.restaurant.count(),
      ]);

      sendSuccess(res, 'Restaurants list', { restaurants, total, page, limit, totalPages: Math.ceil(total / limit) });
    } catch (e) {
      next(e);
    }
  }

  async approveRestaurant(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const restaurant = await prisma.restaurant.update({
        where: { id },
        data: { isApproved: true },
      });
      sendSuccess(res, 'Restaurant approved', { restaurant });
    } catch (e) {
      next(e);
    }
  }

  async getAllOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const status = req.query.status as string | undefined;

      const where: any = {};
      if (status) where.status = status;

      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where,
          include: {
            user: { select: { name: true, email: true } },
            restaurant: { select: { name: true } },
            payment: { select: { method: true, status: true } },
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.order.count({ where }),
      ]);

      sendSuccess(res, 'All orders', { orders, total, page, limit, totalPages: Math.ceil(total / limit) });
    } catch (e) {
      next(e);
    }
  }

  async getAuditLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      const [logs, total] = await Promise.all([
        prisma.auditLog.findMany({
          include: { user: { select: { name: true, email: true } } },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.auditLog.count(),
      ]);

      sendSuccess(res, 'Audit logs', { logs, total, page, limit, totalPages: Math.ceil(total / limit) });
    } catch (e) {
      next(e);
    }
  }
}
