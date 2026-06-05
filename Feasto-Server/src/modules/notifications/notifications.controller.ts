// src/modules/notifications/notifications.controller.ts
import { Request, Response, NextFunction } from 'express';
import { NotificationsRepository } from './notifications.repository';
import { sendSuccess } from '../../shared/utils/apiResponse';

export class NotificationsController {
  private repository: NotificationsRepository;

  constructor() {
    this.repository = new NotificationsRepository();
    this.getAll = this.getAll.bind(this);
    this.markRead = this.markRead.bind(this);
    this.markAllRead = this.markAllRead.bind(this);
    this.remove = this.remove.bind(this);
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      // @ts-ignore
      const result = await this.repository.findByUser(req.user!.userId, page, limit);
      sendSuccess(res, 'Notifications fetched', result);
    } catch (e) {
      next(e);
    }
  }

  async markRead(req: Request, res: Response, next: NextFunction) {
    try {
      await this.repository.markAsRead(req.params.id);
      sendSuccess(res, 'Notification marked as read');
    } catch (e) {
      next(e);
    }
  }

  async markAllRead(req: Request, res: Response, next: NextFunction) {
    try {
      // @ts-ignore
      await this.repository.markAllAsRead(req.user!.userId);
      sendSuccess(res, 'All notifications marked as read');
    } catch (e) {
      next(e);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await this.repository.delete(req.params.id);
      sendSuccess(res, 'Notification deleted');
    } catch (e) {
      next(e);
    }
  }
}
