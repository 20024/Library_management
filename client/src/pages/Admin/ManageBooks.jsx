import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { IoMdArrowRoundBack } from "react-icons/io";
import AddBookModal from "../../component/AddBookModal";
import EditModal from "../../component/EditModal";
import DeleteModal from "../../component/DeleteModal";

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    quality: "",
    availability: true,
  });

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("/book/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(data.books);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch books.");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewBook((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const body = {
        ...newBook,
        price: Number(newBook.price),
        quality: newBook.quality.toString(),
        availability: Boolean(newBook.availability),
      };

      await axios.post("/book/admin/add", body, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowAddModal(false);
      setNewBook({
        title: "",
        author: "",
        description: "",
        price: "",
        quality: "",
        availability: true,
      });
      fetchBooks();
    } catch (err) {
      console.error(err);
      setError("Failed to add book.");
    }
  };

  const handleEditClick = (book) => {
    setSelectedBook(book);
    setShowEditModal(true);
  };

  const handleDeleteClick = (book) => {
    setSelectedBook(book);
    setShowDeleteModal(true);
  };

  const handleDeleteBook = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/books/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(books.filter((book) => book._id !== bookId));
      setShowDeleteModal(false);
      setSelectedBook(null);
    } catch (err) {
      console.error(err);
      setError("Failed to delete book.");
    }
  };

  // Handle book update
  const handleUpdateBook = async (bookId, updatedData) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/books/${bookId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowEditModal(false);
      setSelectedBook(null);
      fetchBooks();
    } catch (err) {
      console.error(err);
      setError("Failed to update book.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 p-6 flex flex-col relative">
      <button
        onClick={() => window.history.back()}
        className="text-gray-700 hover:text-gray-900 text-4xl mb-6 self-start"
        title="Back to Dashboard"
      >
        <IoMdArrowRoundBack />
      </button>

      <h2 className="text-4xl font-semibold mb-6 text-center text-gray-900">
        Books Management
      </h2>

      <div className="mb-6 text-right">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md shadow-md transition"
        >
          + Add Book
        </button>
      </div>

      {error && (
        <p className="mb-6 text-center text-red-600 font-medium">{error}</p>
      )}

      <div className="flex-1 overflow-auto rounded-lg shadow bg-white border border-gray-300">
        <table className="min-w-full border-collapse table-auto">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-5 text-left">Title</th>
              <th className="py-3 px-5 text-left">Author</th>
              <th className="py-3 px-5 text-left">Description</th>
              <th className="py-3 px-5 text-left">Price</th>
              <th className="py-3 px-5 text-left">Quantity</th>
              <th className="py-3 px-5 text-center">Available</th>
              <th className="py-3 px-5 text-left">Created At</th>
              <th className="py-3 px-5 text-left">Updated At</th>
              <th className="py-3 px-5 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.length > 0 ? (
              books.map((book) => (
                <tr key={book._id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-5">{book.title}</td>
                  <td className="py-4 px-5">{book.author}</td>
                  <td
                    className="py-4 px-5 max-w-xs truncate"
                    title={book.description}
                  >
                    {book.description}
                  </td>
                  <td className="py-4 px-5">₹{book.price}</td>
                  <td className="py-4 px-5">{book.quality}</td>
                  <td className="py-4 px-5 text-center">
                    {book.availability ? (
                      <span className="text-green-600 font-semibold">Yes</span>
                    ) : (
                      <span className="text-red-600 font-semibold">No</span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-gray-500">
                    {new Date(book.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-5 text-gray-500">
                    {new Date(book.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-5 space-x-3">
                    <button
                      onClick={() => handleDeleteClick(book)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow-md"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleEditClick(book)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="text-center py-12 text-gray-600 font-semibold"
                >
                  No books found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddBookModal
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        newBook={newBook}
        setNewBook={setNewBook}
        handleAddBook={handleAddBook}
        handleInputChange={handleInputChange}
      />

      {showDeleteModal && selectedBook && (
        <DeleteModal
          show={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          book={selectedBook}
          onDelete={() => handleDeleteBook(selectedBook._id)}
        />
      )}

      {showEditModal && selectedBook && (
        <EditModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          book={selectedBook}
          onUpdate={handleUpdateBook}
        />
      )}
    </div>
  );
};

export default ManageBooks;
