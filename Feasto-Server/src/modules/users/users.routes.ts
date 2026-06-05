// src/modules/users/users.routes.ts
import { Router } from 'express';
import { UsersController } from './users.controller';
import { authenticate } from '../../shared/middleware/authenticate';

const router = Router();
const controller = new UsersController();

// All user routes require authentication
router.use(authenticate);

// Profile
router.get('/me', controller.getProfile);
router.patch('/me', controller.updateProfile);

// Addresses
router.get('/addresses', controller.getAddresses);
router.post('/addresses', controller.addAddress);
router.patch('/addresses/:id', controller.updateAddress);
router.delete('/addresses/:id', controller.deleteAddress);

export default router;
