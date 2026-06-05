// src/modules/admin/admin.routes.ts
import { Router } from 'express';
import { AdminController } from './admin.controller';
import { authenticate } from '../../shared/middleware/authenticate';
import { authorize } from '../../shared/middleware/authorize';

const router = Router();
const controller = new AdminController();

router.use(authenticate);
router.use(authorize('ADMIN'));

router.get('/dashboard', controller.getDashboard);
router.get('/users', controller.getAllUsers);
router.get('/restaurants', controller.getAllRestaurants);
router.patch('/restaurants/:id/approve', controller.approveRestaurant);
router.get('/orders', controller.getAllOrders);
router.get('/audit-logs', controller.getAuditLogs);

export default router;
