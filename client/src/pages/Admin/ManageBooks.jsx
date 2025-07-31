import React, { useEffect, useState } from "react";
import axios from "../../api/axios";

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("/books/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBooks(data.books);
      } catch (err) {
        setError("Failed to fetch books.");
      }
    };

    fetchBooks();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Books section</h2>

      {error && <p className="text-red-500">{error}</p>}

      <table className="min-w-full bg-white shadow rounded-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4">Title</th>
            <th className="py-2 px-4">Author</th>
            <th className="py-2 px-4">Available</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books?.map((book) => (
            <tr key={book._id} className="border-t">
              <td className="py-2 px-4">{book.title}</td>
              <td className="py-2 px-4">{book.author}</td>
              <td className="py-2 px-4">{book.available ? "Yes" : "No"}</td>
              <td className="py-2 px-4 space-x-2">
                <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                  Delete
                </button>
                <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageBooks;
