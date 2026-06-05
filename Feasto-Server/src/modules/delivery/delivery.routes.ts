// src/modules/delivery/delivery.routes.ts
import { Router } from 'express';
import { DeliveryController } from './delivery.controller';
import { authenticate } from '../../shared/middleware/authenticate';
import { authorize } from '../../shared/middleware/authorize';

const router = Router();
const controller = new DeliveryController();

router.use(authenticate);

// Delivery partner routes
router.post('/register', authorize('DELIVERY_PARTNER'), controller.register);
router.get('/profile', authorize('DELIVERY_PARTNER'), controller.getProfile);
router.patch('/availability', authorize('DELIVERY_PARTNER'), controller.toggleAvailability);
router.post('/location', authorize('DELIVERY_PARTNER'), controller.updateLocation);
router.get('/my', authorize('DELIVERY_PARTNER'), controller.getMyDeliveries);
router.get('/earnings', authorize('DELIVERY_PARTNER'), controller.getMyEarnings);

// Shared routes
router.get('/order/:orderId', controller.getDeliveryByOrder);
router.patch('/order/:orderId/status', authorize('DELIVERY_PARTNER'), controller.updateDeliveryStatus);

export default router;
