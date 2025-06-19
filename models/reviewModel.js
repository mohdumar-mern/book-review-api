import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const reviewSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    trim: true,
    required: true,
  }
}, {
  timestamps: true
});
reviewSchema.plugin(mongoosePaginate);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
