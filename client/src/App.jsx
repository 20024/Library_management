import React, { useState, useEffect } from "react";
import './App.css';

export default function App() {
  const [books, setBooks] = useState([]);
  const [memberId, setMemberId] = useState("");
  const [selectedBook, setSelectedBook] = useState("");

  useEffect(() => {
    setBooks([
      { 
        book_id: 1, 
        title: "The Alchemist", 
        author: "Paulo Coelho", 
        available_copies: 3,
        issue_date: null,
        return_date: null
      },
      { 
        book_id: 2, 
        title: "1984", 
        author: "George Orwell", 
        available_copies: 1,
        issue_date: null,
        return_date: null
      },
      { 
        book_id: 3, 
        title: "Clean Code", 
        author: "Robert C. Martin", 
        available_copies: 2,
        issue_date: null,
        return_date: null
      },
      { 
        book_id: 4, 
        title: "Code", 
        author: "Martin", 
        available_copies: 5,
        issue_date: null,
        return_date: null
      },
    ]);
  }, []);

  const issueBook = () => {
    if (!memberId || !selectedBook) {
      alert("Please fill all fields");
      return;
    }

    setBooks(prevBooks =>
      prevBooks.map(book => {
        if (book.book_id === parseInt(selectedBook) && book.available_copies > 0) {
          const today = new Date();
          const returnDate = new Date();
          returnDate.setDate(today.getDate() + 7); // 7 days later
          
          return {
            ...book,
            available_copies: book.available_copies - 1,
            issue_date: today.toLocaleDateString(),
            return_date: returnDate.toLocaleDateString()
          };
        }
        return book;
      })
    );

    alert(`Issued book ID ${selectedBook} to member ID ${memberId}`);
    setSelectedBook("");
    setMemberId("");
  };

  const deleteBook = (book_id) => {
    setBooks(prevBooks => prevBooks.filter(book => book.book_id !== book_id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Library Management System</h1>

      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded p-4">
        <h2 className="text-xl font-semibold mb-4">Available Books</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Title</th>
              <th className="border p-2">Author</th>
              <th className="border p-2">Available</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Issue Date</th>
              <th className="border p-2">Return Date</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => {
              const isAvailable = book.available_copies > 0;
              return (
                <tr key={book.book_id}>
                  <td className="border p-2">{book.book_id}</td>
                  <td className="border p-2">{book.title}</td>
                  <td className="border p-2">{book.author}</td>
                  <td className="border p-2">{book.available_copies}</td>
                  <td className={`border p-2 ${isAvailable ? "text-green-600" : "text-red-600"}`}>
                    {isAvailable ? "Available" : "Not Available"}
                  </td>
                  <td className="border p-2">{book.issue_date || "-"}</td>
                  <td className="border p-2">{book.return_date || "-"}</td>
                  <td className="border p-2">
                    <button 
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      onClick={() => deleteBook(book.book_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Issue Book</h2>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Member ID"
              className="border p-2 rounded"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
            />
            <select
              className="border p-2 rounded"
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
            >
              <option value="">Select Book</option>
              {books
                .filter((book) => book.available_copies > 0)
                .map((book) => (
                  <option key={book.book_id} value={book.book_id}>
                    {book.title}
                  </option>
                ))}
            </select>
            <button
              className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
              onClick={issueBook}
            >
              Issue Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
