import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isPDF = file.mimetype === 'application/pdf';
    const folder = isPDF ? 'pdfs' : 'images';
    const resourceType = isPDF ? 'raw' : 'image'; // ✅ force PDF as raw
    const originalName = file.originalname.split('.')[0].replace(/\s+/g, "_");

    return {
      folder: `book-library/${folder}`,
      resource_type: resourceType,
      public_id: `${Date.now()}-${originalName}`,
    };
  },
});

const upload = multer({ storage });

export default upload;
