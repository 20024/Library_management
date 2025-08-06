import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { FiClipboard, FiCheck } from "react-icons/fi"; 

const Book = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/book/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBooks(res.data.books);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch books.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-indigo-800 mb-10">
        Available Books
      </h1>

      {loading && (
        <p className="text-center text-gray-500 text-lg">Loading books...</p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {books.map((book) => (
          <div
            key={book._id}
            className="bg-white p-5 rounded-xl shadow-lg border hover:shadow-2xl transition-all duration-300"
          >
            <h2 className="text-2xl font-bold text-indigo-700 mb-2 truncate">
              {book.title}
            </h2>
            <p className="text-gray-700 mb-1">
              <span className="font-medium">Author:</span> {book.author}
            </p>
            <p className="text-gray-700 mb-1">
              <span className="font-medium">Description:</span>{" "}
              {book.description.length > 100
                ? book.description.slice(0, 100) + "..."
                : book.description}
            </p>

            <div className="text-gray-700 mb-1 flex items-center gap-4">
              <span className="font-medium">Book ID:</span>
              <span className="text-sm break-all">{book._id}</span>
              <button
                onClick={() => handleCopy(book._id)}
                className="text-indigo-600 hover:text-indigo-800 transition"
                aria-label="Copy Book ID"
              >
                {copiedId === book._id ? (
                  <FiCheck className="w-3 h-3" title="Copied!" />
                ) : (
                  <FiClipboard className="w-4 h-4" />
                )}
              </button>
            </div>

            <p className="text-gray-700 mb-1">
              <span className="font-medium">Price:</span> ₹{book.price}
            </p>
            <p className="text-gray-700 mb-1">
              <span className="font-medium">Quantity:</span> {book.quality}
            </p>
            <div className="mt-4">
              <span
                className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                  book.availability
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {book.availability ? "Available" : "Unavailable"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Book;
