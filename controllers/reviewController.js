import expressAsyncHandler from "express-async-handler";
import Review from "../models/reviewModel.js";

// @desc    Get reviews for a book
// @route   GET /api/reviews?bookId=BOOK_ID
// @access  Public
export const getReviews = expressAsyncHandler(async (req, res) => {
  const { bookId } = req.query;

  if (!bookId) {
    return res.status(400).json({ message: "bookId query param is required" });
  }

  

  const reviews = await Review.find({ book: bookId })
    .populate("user", "name email").sort({ createdAt: -1 })
    .lean();

 

  return res.status(200).json({ message: "Reviews fetched", reviews });
});

// @desc    Submit a new review
// @route   POST /api/reviews
// @access  Public or Protected
export const addReview = expressAsyncHandler(async (req, res) => {
  const { book, rating, comment } = req.body;
  const user = req.user._id;

  if (!book || !rating || !comment) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const review = new Review({ book, user, rating, comment });
  const savedReview = await review.save();

  return res.status(201).json({ message: "Review added", review: savedReview });
});
