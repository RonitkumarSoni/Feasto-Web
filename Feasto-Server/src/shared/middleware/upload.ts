import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env';

// Configure Cloudinary
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

// Setup Multer Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Generate a unique folder based on the route or entity (e.g., 'restaurants', 'foods', 'users')
    let folder = 'feasto_uploads';
    if (req.baseUrl.includes('restaurants')) folder = 'feasto_restaurants';
    if (req.baseUrl.includes('foods')) folder = 'feasto_foods';
    if (req.baseUrl.includes('users')) folder = 'feasto_users';

    return {
      folder: folder,
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    };
  },
});

export const upload = multer({ storage });
