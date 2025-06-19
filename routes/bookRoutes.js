import express from "express";
const router = express.Router();

import { protect, adminOnly } from "../middleware/jwtMiddleware.js";
import upload from "../middleware/multerMiddleware.js";
import { addBook, getBooks, getSingleBook, downloadBookFile, deleteBook } from "../controllers/bookController.js";

// @route   GET /api/books
// @desc    Get all books
router.get("/", getBooks);

// @route   GET /api/books/:id
// @desc    Get single book by ID
router.get("/:id", getSingleBook);
router.delete("/:id",protect,adminOnly, deleteBook);

// @route   GET /api/books/:id
// @desc    Get single book by ID to Download
router.get("/:id/book", downloadBookFile);

// @route   POST /api/books
// @desc    Add new book (Admin only)
router.post(
  "/",
  protect,
  adminOnly,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "book", maxCount: 1 },
  ]),
  addBook
);

export default router;
