import React from 'react';

function AddBookModal({
  showAddModal,
  setShowAddModal,
  newBook,
  setNewBook,
  handleAddBook,
  handleInputChange,
}) {
  if (!showAddModal) return null;

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-40 flex items-center justify-center z-50" style={{ backdropFilter: "blur(2px)" }}>
      <div className="bg-white w-full max-w-md h-fit p-6 overflow-y-auto shadow-2xl">
        <h3 className="text-xl font-semibold mb-4">Add New Book</h3>
        <form onSubmit={handleAddBook} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            required
            value={newBook.title}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="text"
            name="author"
            placeholder="Author"
            required
            value={newBook.author}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          <textarea
            name="description"
            placeholder="Description"
            required
            value={newBook.description}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2 resize-none"
            rows={3}
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            required
            value={newBook.price}
            onChange={handleInputChange}
            min="0"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="text"
            name="quality"
            placeholder="Quantity"
            required
            value={newBook.quality}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              name="availability"
              checked={newBook.availability}
              onChange={handleInputChange}
              className="form-checkbox"
            />
            <span>Available</span>
          </label>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
            >
              Add Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBookModal;
