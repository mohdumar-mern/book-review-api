import express from "express";
import {
  getReviews,
  addReview,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/jwtMiddleware.js";

const router = express.Router();

router.get("/", getReviews);     // /api/reviews?bookId=BOOK_ID
router.post("/",protect, addReview);     // /api/reviews

export default router;
