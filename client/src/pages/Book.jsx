import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { FaBookOpen, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const userEmail = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBooksAndBorrowed = async () => {
      try {
        setLoading(true);
        setError("");

        const booksRes = await axios.get("/book/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBooks(booksRes.data.books || []);

        const borrowsRes = await axios.get("/borrow", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const allBorrows = borrowsRes.data.data || [];

        const userBorrows = allBorrows.filter(
          (b) =>
            b.user.email.toLowerCase() === userEmail.toLowerCase() &&
            b.status !== "Returned"
        );

        setBorrowedBooks(userBorrows);
        setLoading(false);
      } catch (err) {
        setError("You are not logged in. Please login to view books.");
        setLoading(false);
      }
    };

    fetchBooksAndBorrowed();
  }, [userEmail, token]);

  const handleBorrow = async (bookId) => {
    setMessage("");
    setError("");

    try {
      await axios.post(
        "/borrow/recordallBooks",
        {
          email: userEmail,
          bookId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Book borrowed successfully! Refreshing list...");

      // Refresh list
      const booksRes = await axios.get("/book/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBooks(booksRes.data.books || []);

      const borrowsRes = await axios.get("/borrow", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const allBorrows = borrowsRes.data.data || [];
      const userBorrows = allBorrows.filter(
        (b) =>
          b.user.email.toLowerCase() === userEmail.toLowerCase() &&
          b.status !== "Returned"
      );
      setBorrowedBooks(userBorrows);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to borrow book. Maybe you already borrowed it or it's unavailable."
      );
    }
  };

  const isBorrowed = (bookId) =>
    borrowedBooks.some((borrow) => borrow.book._id === bookId);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Available Books</h1>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {message && <p className="text-center text-green-500">{message}</p>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.length === 0 && !loading ? (
          <p className="col-span-full text-center text-gray-600">
            No books available at the moment.
          </p>
        ) : (
          books.map((book) => (
            <div key={book._id} className="bg-white p-5 shadow-md rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{book.title}</h2>
                <FaBookOpen className="text-blue-600 text-2xl" />
              </div>
              <p className="text-gray-600 mb-2">Author: {book.author}</p>
              <p className="text-gray-600 mb-2">Genre: {book.genre}</p>

              <div className="flex items-center gap-2 mb-4">
                {isBorrowed(book._id) ? (
                  <span className="text-red-600 flex items-center">
                    <FaTimesCircle className="mr-1" />
                    Already Borrowed
                  </span>
                ) : (
                  <span className="text-green-600 flex items-center">
                    <FaCheckCircle className="mr-1" />
                    Available
                  </span>
                )}
              </div>

              <button
                onClick={() => handleBorrow(book._id)}
                disabled={isBorrowed(book._id)}
                className={`w-full py-2 rounded text-white ${
                  isBorrowed(book._id)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isBorrowed(book._id) ? "Borrowed" : "Borrow"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Books;
