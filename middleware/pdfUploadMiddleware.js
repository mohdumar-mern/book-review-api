// middleware/pdfUploadMiddleware.js
import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";

const handlePDFUpload = async (req, res, next) => {
  try {
    const bookFile = req.files?.book?.[0];

    if (!bookFile) {
      return res.status(400).json({ message: "Book file is required" });
    }

    const bufferStream = new Readable();
    bufferStream.push(bookFile.buffer);
    bufferStream.push(null);

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "book-review/books",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      bufferStream.pipe(uploadStream);
    });

    // Attach result to request object
    req.pdfUploadResult = {
      public_id: result.public_id,
      url: result.secure_url,
      filename: result.original_filename,
      path: result.secure_url, // To match multer's output
    };

    next();
  } catch (error) {
    console.error("PDF upload error:", error.message);
    return res.status(500).json({ message: "PDF upload failed" });
  }
};

export default handlePDFUpload;
