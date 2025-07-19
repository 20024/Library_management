import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { format } from "date-fns";

const Borrow = () => {
  const [borrows, setBorrows] = useState([]);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ userId: "", bookId: "" });

  const fetchBorrows = async () => {
    try {
      const res = await axios.get("/borrow");
      setBorrows(res.data);
    } catch (error) {
      console.error("Failed to fetch borrow records:", error);
    }
  };

  const fetchUsersBooks = async () => {
    try {
      const usersRes = await axios.get("/users");
      const booksRes = await axios.get("/books");
      setUsers(usersRes.data);
      setBooks(booksRes.data);
    } catch (error) {
      console.error("Failed to fetch users or books:", error);
    }
  };

  const handleBorrow = async () => {
    if (!formData.userId || !formData.bookId) return alert("All fields required");
    try {
      await axios.post("/borrow", formData);
      setFormData({ userId: "", bookId: "" });
      fetchBorrows();
    } catch (error) {
      alert(error.response?.data?.message || "Borrow failed");
    }
  };

  const handleReturn = async (id) => {
    try {
      await axios.put(`/borrow/return/${id}`);
      fetchBorrows();
    } catch (error) {
      alert(error.response?.data?.message || "Return failed");
    }
  };

  useEffect(() => {
    fetchBorrows();
    fetchUsersBooks();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Borrow Book</h2>

      <div className="flex gap-4 mb-6">
        <select
          className="border px-4 py-2 rounded"
          value={formData.userId}
          onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>

        <select
          className="border px-4 py-2 rounded"
          value={formData.bookId}
          onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
        >
          <option value="">Select Book</option>
          {books.map((book) => (
            <option key={book._id} value={book._id}>
              {book.title}
            </option>
          ))}
        </select>

        <button onClick={handleBorrow} className="bg-blue-600 text-white px-4 py-2 rounded">
          Borrow
        </button>
      </div>

      <table className="w-full border text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">User</th>
            <th className="p-2">Book</th>
            <th className="p-2">Borrowed On</th>
            <th className="p-2">Due Date</th>
            <th className="p-2">Returned</th>
            <th className="p-2">Fine</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {borrows.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center p-4">
                No borrow records found.
              </td>
            </tr>
          ) : (
            borrows.map((item) => (
              <tr key={item._id}>
                <td className="p-2">{item.user?.name || "N/A"}</td>
                <td className="p-2">{item.book?.title || "N/A"}</td>
                <td className="p-2">{format(new Date(item.borrowedAt), "dd MMM yyyy")}</td>
                <td className="p-2">{format(new Date(item.dueDate), "dd MMM yyyy")}</td>
                <td className="p-2">{item.returned ? "Yes" : "No"}</td>
                <td className="p-2">₹{item.fine || 0}</td>
                <td className="p-2">
                  {!item.returned && (
                    <button
                      onClick={() => handleReturn(item._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Return
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Borrow;
