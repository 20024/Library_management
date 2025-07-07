import { Book } from "../models/bookModels.js";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/errorMiddleware.js";
// import { user } from "../models/userModels.js";

// @desc    Add a new book (Admin only)
// @route   POST /api/admin/add
export const addBook = catchAsyncErrors(async (req, res, next) => {
  const { title, author, description, price, quality, availability } = req.body;

  if (!title || !author || !description || !price || !quality) {
    return next(new ErrorHandler("Please fill all required fields.", 400));
  }

  const book = await Book.create({
    title,
    author,
    description,
    price,
    quality,
    availability,
  });

  res.status(201).json({
    success: true,
    message: "Book added successfully",
    book,
  });
});

// @desc    Get all books (Authenticated users)
// @route   GET /api/all
export const getAllBooks = catchAsyncErrors(async (req, res, next) => {
  const books = await Book.find();

  res.status(200).json({
    success: true,
    count: books.length,
    books,
  });
});

// @desc    Delete a book by ID (Admin only)
// @route   DELETE /api/books/:id
export const deleteBook = catchAsyncErrors(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  await book.deleteOne();

  res.status(200).json({
    success: true,
    message: "Book deleted successfully",
  });
});
