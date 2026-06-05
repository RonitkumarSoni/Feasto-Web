// src/modules/restaurants/restaurants.routes.ts
import { Router } from 'express';
import { RestaurantsController } from './restaurants.controller';
import { authenticate } from '../../shared/middleware/authenticate';
import { authorize } from '../../shared/middleware/authorize';

const router = Router();
const controller = new RestaurantsController();

// Public Routes
router.get('/', controller.getAll);
router.get('/:id', controller.getById);

// Protected Routes (Restaurant Owner)
router.use(authenticate);
router.use(authorize('RESTAURANT_OWNER', 'ADMIN'));

router.post('/', controller.create);
router.patch('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
