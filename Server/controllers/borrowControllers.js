import Borrow from "../models/borrowModels.js";
import { Book } from "../models/bookModels.js";
import { User } from "../models/userModels.js"; 
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/errorMiddleware.js";
import { calculateFine } from "../utils/calculateFine.js";

export const recordBorroedBook = catchAsyncErrors(async (req, res, next) => {
  const { email, bookId } = req.body;

  console.log("Incoming Email:", email);
  console.log(" Incoming Book ID:", bookId);

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

export const returnBorrowedBook = catchAsyncErrors(async (req, res, next) => {
  const { borrowId } = req.params;

  const borrow = await Borrow.findById(borrowId);
  if (!borrow) {
    return next(new ErrorHandler("Borrow record not found", 404));
  }

  if (borrow.status === "Returned") {
    return next(new ErrorHandler("Book has already been returned", 400));
  }

  const currentDate = new Date();
  borrow.returnDate = currentDate;
  borrow.status = "Returned";

  // Calculate fine using utility function
  borrow.fine = calculateFine(borrow.dueDate, currentDate);

  await borrow.save();
  console.log("🔎 Borrow ID from URL:", borrowId);

  // Update book availability
  const book = await Book.findById(borrow.book);
  if (book) {
    book.isAvailable = true;
    await book.save();
  }

  res.status(200).json({
    success: true,
    message: "Book returned successfully",
    data: {
      returnDate: borrow.returnDate,
      fine: borrow.fine,
      status: borrow.status,
    },
  });
});

export const getUserBorrowRecords = catchAsyncErrors(async (req, res, next) => {
  try {
    const userId = req.user._id;

    const borrows = await Borrow.find({ "user.id": userId })
      .populate({
        path: "book",
        select: "title author price", // Add more if you need
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      borrows,
    });
  } catch (error) {
    console.error("Error fetching borrow records:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch borrow records",
    });
  }
});

