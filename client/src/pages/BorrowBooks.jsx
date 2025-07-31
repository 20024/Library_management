import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const BorrowedBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [error, setError] = useState("");

  const userEmail = localStorage.getItem("email");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const response = await axios.get(`/borrow/user/${userEmail}`);
        setBorrowedBooks(response.data.borrowedBooks);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to load borrowed books");
        setBorrowedBooks([]);
      }
    };

    if (userEmail) {
      fetchBorrowedBooks();
    } else {
      setError("User not logged in");
    }
  }, [userEmail]);

  return (
    <div className="p-8 min-h-screen bg-gray-50 relative">
      <button
        onClick={() => navigate("/dashboard")}
        className="absolute top-7 left-15 text-gray-600 hover:text-gray-900 text-4xl"
        title="Back to Dashboard"
      >
        <IoMdArrowRoundBack />
      </button>

      <h2 className="text-3xl font-semibold mb-6 text-center">Your Borrowed Books</h2>

      {error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : borrowedBooks.length === 0 ? (
        <p className="text-center text-gray-600">You haven't borrowed any books yet.</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Title</th>
                <th className="py-3 px-6 text-left">Borrow Date</th>
                <th className="py-3 px-6 text-left">Return Date</th>
              </tr>
            </thead>
            <tbody>
              {borrowedBooks.map((book, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6">{book.title}</td>
                  <td className="py-3 px-6">{new Date(book.borrowDate).toLocaleDateString()}</td>
                  <td className="py-3 px-6">{new Date(book.returnDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BorrowedBooks;
