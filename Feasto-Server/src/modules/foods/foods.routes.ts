// src/modules/foods/foods.routes.ts
import { Router } from 'express';
import { FoodsController } from './foods.controller';
import { authenticate } from '../../shared/middleware/authenticate';
import { authorize } from '../../shared/middleware/authorize';

const router = Router();
const controller = new FoodsController();

// Public Routes
router.get('/restaurant/:restaurantId', controller.getByRestaurant);
router.get('/:id', controller.getById);

// Protected Routes (Restaurant Owner)
router.use(authenticate);
router.use(authorize('RESTAURANT_OWNER', 'ADMIN'));

router.post('/', controller.create);
router.patch('/:id', controller.update);
router.delete('/:id', controller.delete);

router.post('/:id/variants', controller.addVariant);
router.post('/:id/addons', controller.addAddon);

export default router;
