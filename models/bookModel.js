import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const bookSchema = new mongoose.Schema(
  {
    title: String,
    author: String,
    description: String,
    genre: String,
    featured: { type: Boolean, default: false },
    thumbnail: {
      url: String,
      public_id: String,
    },
    book: {
      url: String,
      public_id: String,
    },
  },
  {
    timestamps: true,
  }
);
bookSchema.plugin(mongoosePaginate);

const Book = mongoose.model("Book", bookSchema);
export default Book;
