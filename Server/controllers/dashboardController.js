import  { Book } from "../models/bookModels.js";
import Borrow from "../models/borrowModels.js";

export const getDashboardStats = async (req, res) => {
  try {
    const booksCount = await Book.countDocuments();

    const borrows = await Borrow.find();

    const activeBorrows = borrows.filter(b => b.status !== "Returned").length;

    const overdue = borrows.filter(b => {
      const due = new Date(b.dueDate);
      return !b.returnDate && due < new Date();
    }).length;

    res.status(200).json({
      books: booksCount,
      activeBorrows,
      overdue,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
