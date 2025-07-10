import Borrow from "../models/borrowModels.js";
import { Book } from "../models/bookModels.js";
import { User } from "../models/userModels.js"; // ✅ Your valid named export
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/errorMiddleware.js";

export const recordBorroedBook = catchAsyncErrors(async (req, res, next) => {
  const { email, bookId } = req.body;

  console.log("📨 Incoming Email:", email);
  console.log("📘 Incoming Book ID:", bookId);

  const book = await Book.findById(bookId);
  if (!book) {
    console.log("Book not found");
    return next(new ErrorHandler("Book not found", 404));
  }

  const user = await User.findOne({ email: new RegExp(`^${email.trim()}$`, "i") });
  if (!user) {
    console.log("User not found for email:", email);
    return next(new ErrorHandler("User not found", 404));
  }

   if (!user.borrowedBooks) {
    user.borrowedBooks = [];
  }
  
  if (book.quantity === 0) {
    return next(new ErrorHandler("Book not available.", 400));
  }

  const isAlreadyBorrowed = user.borrowedBooks.find(
    (b) => b.bookId.toString() === bookId && b.returned === false
  );

  if (isAlreadyBorrowed) {
    return next(new ErrorHandler("Book already borrowed.", 400));
  }

  book.quantity -= 1;
  book.availability = book.quantity > 0;
  await book.save();

  user.borrowedBooks.push({
    bookId: book._id,
    bookTitle: book.title,
    borrowDate: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    price: book.price,
  });

  await user.save();

  const borrow = await Borrow.create({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    book: book._id,
    title: book.title,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    price: book.price,
  });

  res.status(201).json({
    success: true,
    message: "Borrowed book recorded successfully",
    borrow,
  });
});
