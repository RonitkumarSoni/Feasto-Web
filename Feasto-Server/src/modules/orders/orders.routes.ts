// src/modules/orders/orders.routes.ts
import { Router } from 'express';
import { OrdersController } from './orders.controller';
import { authenticate } from '../../shared/middleware/authenticate';
import { authorize } from '../../shared/middleware/authorize';

const router = Router();
const controller = new OrdersController();

router.use(authenticate);

// Customer routes
router.post('/', controller.createOrder);
router.get('/my', controller.getMyOrders);
router.get('/:id', controller.getOrder);
router.patch('/:id/status', controller.updateStatus);
router.post('/:id/reorder', controller.reorder);

// Restaurant owner routes
router.get('/restaurant/:restaurantId', authorize('RESTAURANT_OWNER', 'ADMIN'), controller.getRestaurantOrders);

export default router;
