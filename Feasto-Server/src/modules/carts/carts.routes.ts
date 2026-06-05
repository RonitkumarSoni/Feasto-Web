// src/modules/carts/carts.routes.ts
import { Router } from 'express';
import { CartsController } from './carts.controller';
import { authenticate } from '../../shared/middleware/authenticate';

const router = Router();
const controller = new CartsController();

router.use(authenticate);

router.get('/', controller.getCart);
router.post('/items', controller.addItem);
router.patch('/items/:itemId', controller.updateItem);
router.delete('/items/:itemId', controller.removeItem);
router.delete('/', controller.clearCart);

export default router;
