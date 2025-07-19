import React from "react";

const books = [
  { id: 1, title: "Clean Code", author: "Robert C. Martin", category: "Programming", available: true },
  { id: 2, title: "Atomic Habits", author: "James Clear", category: "Self-help", available: false },
];

const fetchBooks = async () => {
  try {
    const response = await axios.get("/books");
    setBooks(response.data);
  } catch (error) {
    console.error("Failed to fetch books:", error);
  }
};


const Book = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Books List</h2>
      <table className="w-full border rounded-lg shadow-sm">
        <thead>
          <tr className="bg-indigo-100">
            <th className="p-3 text-left">Title</th>
            <th className="p-3 text-left">Author</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Available</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id} className="border-t">
              <td className="p-3">{book.title}</td>
              <td className="p-3">{book.author}</td>
              <td className="p-3">{book.category}</td>
              <td className="p-3">{book.available ? "Yes" : "No"}</td>
              <td className="p-3">
                <button className="text-indigo-600 hover:underline mr-2">Edit</button>
                <button className="text-red-500 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Book;
