// src/modules/payments/payments.routes.ts
import { Router } from 'express';
import { PaymentsController } from './payments.controller';
import { authenticate } from '../../shared/middleware/authenticate';

const router = Router();
const controller = new PaymentsController();

router.use(authenticate);

router.post('/initiate', controller.initiate);
router.post('/verify', controller.verify);
router.get('/order/:orderId', controller.getByOrder);

export default router;
