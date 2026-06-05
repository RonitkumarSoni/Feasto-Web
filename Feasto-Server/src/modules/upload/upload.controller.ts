import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/utils/apiResponse';
import { AppError } from '../../shared/middleware/errorHandler';

export class UploadController {
  
  constructor() {
    this.uploadImage = this.uploadImage.bind(this);
    this.uploadMultipleImages = this.uploadMultipleImages.bind(this);
  }

  async uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new AppError('No file uploaded', 400);
      }
      
      // req.file contains path which is the Cloudinary URL
      sendSuccess(res, 'Image uploaded successfully', {
        url: req.file.path,
        publicId: req.file.filename, // Cloudinary public_id
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadMultipleImages(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        throw new AppError('No files uploaded', 400);
      }

      const files = req.files as Express.Multer.File[];
      const urls = files.map(file => ({
        url: file.path,
        publicId: file.filename,
      }));

      sendSuccess(res, 'Images uploaded successfully', {
        images: urls,
      });
    } catch (error) {
      next(error);
    }
  }
}
