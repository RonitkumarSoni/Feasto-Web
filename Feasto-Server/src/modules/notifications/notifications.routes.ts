// src/modules/notifications/notifications.routes.ts
import { Router } from 'express';
import { NotificationsController } from './notifications.controller';
import { authenticate } from '../../shared/middleware/authenticate';

const router = Router();
const controller = new NotificationsController();

router.use(authenticate);

router.get('/', controller.getAll);
router.patch('/:id/read', controller.markRead);
router.patch('/read-all', controller.markAllRead);
router.delete('/:id', controller.remove);

export default router;
