// src/modules/reviews/reviews.routes.ts
import { Router } from 'express';
import { ReviewsController } from './reviews.controller';
import { authenticate } from '../../shared/middleware/authenticate';

const router = Router();
const controller = new ReviewsController();

// Public
router.get('/restaurant/:restaurantId', controller.getByRestaurant);
router.get('/food/:foodId', controller.getByFood);
router.get('/restaurant/:restaurantId/rating', controller.getRating);

// Authenticated
router.post('/', authenticate, controller.create);
router.delete('/:id', authenticate, controller.remove);

export default router;
