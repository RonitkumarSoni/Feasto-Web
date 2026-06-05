// src/modules/coupons/coupons.routes.ts
import { Router } from 'express';
import { CouponsController } from './coupons.controller';
import { authenticate } from '../../shared/middleware/authenticate';
import { authorize } from '../../shared/middleware/authorize';

const router = Router();
const controller = new CouponsController();

// Public
router.get('/active', controller.getActive);

// Authenticated
router.post('/apply', authenticate, controller.apply);

// Admin only
router.post('/', authenticate, authorize('ADMIN'), controller.create);
router.get('/', authenticate, authorize('ADMIN'), controller.getAll);
router.delete('/:id', authenticate, authorize('ADMIN'), controller.remove);

export default router;
