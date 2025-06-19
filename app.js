// app.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

// ✅ Load environment variables
dotenv.config();

// ✅ Import custom middleware and routes
import { pageNotFound, errorHandling } from "./middleware/errorHandlingMiddleware.js";
import booksRoutes from "./routes/bookRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

// ✅ Global Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || "https://book-review-platform-2wvn.onrender.com/",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

// ✅ API Routes
app.use("/api/books", booksRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/auth", userRoutes);



// ✅ Error Handling Middleware (must come last)
app.use(pageNotFound);
app.use(errorHandling);

export default app;
