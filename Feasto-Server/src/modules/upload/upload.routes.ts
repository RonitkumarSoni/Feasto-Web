import { Router } from 'express';
import { UploadController } from './upload.controller';
import { upload } from '../../shared/middleware/upload';
import { authenticate } from '../../shared/middleware/authenticate';

const router = Router();
const controller = new UploadController();

// All upload routes require authentication
router.use(authenticate);

// Upload a single image
router.post('/image', upload.single('image'), controller.uploadImage);

// Upload multiple images (max 5)
router.post('/images', upload.array('images', 5), controller.uploadMultipleImages);

export default router;
