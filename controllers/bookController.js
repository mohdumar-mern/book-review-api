import expressAsyncHandler from "express-async-handler";
import Book from "../models/bookModel.js";
import axios from "axios";


// @desc    Get all Books (paginated)
// @route   GET /api/books
// @access  Public
export const getBooks = expressAsyncHandler(async (req, res) => {
  const { page = 1, limit = 6, search = "", featured } = req.query;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    lean: true,
    sort: { createdAt: -1 }
  };

  // Create query object for filtering
  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { author: { $regex: search, $options: "i" } },
    ];
  }
    // ⭐ Filter featured books
    if (featured === "true") {
      query.featured = true;
    }

  const books = await Book.paginate(query, options);

  if (!books || books.docs.length === 0) {
    return res.status(404).json({ message: "No books found" });
  }

  const response = {
    data: books.docs,
    totalDocs: books.totalDocs,
    limit: books.limit,
    totalPages: books.totalPages,
    currentPage: books.page,
    pagingCounter: books.pagingCounter,
    hasPrevPage: books.hasPrevPage,
    hasNextPage: books.hasNextPage,
    prevPage: books.prevPage,
    nextPage: books.nextPage,
  };

  return res
    .status(200)
    .json({ message: "Books retrieved successfully", ...response });
});


// @desc    Get Single Book
// @route   GET /api/books/:id
// @access  Public
export const getSingleBook = expressAsyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id).lean();
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res
    .status(200)
    .json({ message: "Book retrieved successfully", book });
});

// @desc    Download book file
// @route   GET /api/books/:id/download
// @access  Public
export const downloadBookFile = expressAsyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book || !book.book?.url) {
    res.status(404);
    throw new Error("Book not found");
  }

  const fileUrl = book.book?.url;

  const response = await axios.get(fileUrl, { responseType: 'stream' });

  res.set({
    'Content-Disposition': 'attachment; filename="book.pdf"',
    'Content-Type': 'application/pdf',
  });

  response.data.pipe(res);
});


// @desc    Add Book
// @route   POST /api/books
// @access  Admin Only
export const addBook = expressAsyncHandler(async (req, res) => {
  const { title, author, description, genre, featured } = req.body;

  if (!title || !author || !description || !genre) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const thumbnail = req.files?.thumbnail[0];
  const bookFile = req.files?.book[0];


  if (!thumbnail || !bookFile) {
    return res
      .status(400)
      .json({ message: "Thumbnail and book file are required" });
  }

  // ✅ No need to upload manually. Use values from multer-cloudinary
  const newBook = new Book({
    title,
    author,
    description,
    genre,
    featured: featured === "true",
    thumbnail: {
      public_id: thumbnail.filename,
      url: thumbnail.path,
    },
    book: {
      public_id: bookFile.filename,
      url: bookFile.path,
    },
  });

  const savedBook = await newBook.save();

  if (!savedBook) {
    return res.status(400).json({ message: "Book adding failed" });
  }

  return res
    .status(201)
    .json({ message: "Book added successfully", books: savedBook });
});


// @desc    Delete Single Book
// @route   DEKETE /api/books/:id
// @access  Public
export const deleteBook = expressAsyncHandler(async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id).lean();
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  
  return res
    .status(200)
    .json({ message: "Book delete successfully" });
});