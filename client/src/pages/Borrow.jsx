import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { format } from 'date-fns';

const Borrow = () => {
  const [borrows, setBorrows] = useState([]);
  const [email, setEmail] = useState('');
  const [bookId, setBookId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBorrows = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('/borrow/recordBooks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBorrows(data.borrows);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch borrowed books');
      } finally {
        setLoading(false);
      }
    };

    fetchBorrows();
  }, []);

  const handleReturn = async (borrowId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/borrow/return/${borrowId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBorrows((prev) =>
        prev.map((b) =>
          b._id === borrowId
            ? {
              ...b,
              status: 'Returned',
              returned: true,
              returnDate: new Date().toISOString(), // update return date
            }
            : b
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to return book');
    }
  };

  const handleBorrow = async () => {
    if (!email || !bookId) {
      alert('Please enter email and book ID');
      return;
    }

    try {
      const { data } = await axios.post('/borrow/recordallBooks', { email, bookId });
      setBorrows((prev) => [...prev, data.borrow]);
      setEmail('');
      setBookId('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to borrow book');
    }
  };


  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded-md mt-10">
      <h2 className="text-4xl font-bold text-center text-indigo-800 mb-10">Borrow a Book</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center">
        <input
          type="email"
          placeholder="User Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
        />
        <input
          type="text"
          placeholder="Book ID"
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
        />
        <button
          onClick={handleBorrow}
          className="bg-blue-600 text-white rounded-md px-6 py-2 hover:bg-blue-700 transition"
        >
          Borrow
        </button>
      </div>

      {error && (
        <p className="text-center text-red-600 font-semibold mb-6">{error}</p>
      )}

      <h3 className="text-2xl font-semibold mb-4 text-gray-700">Borrow Records</h3>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-md table-auto">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Book Title</th>
                <th className="py-3 px-4 text-left">Borrow Date</th>
                <th className="py-3 px-4 text-left">Due Date</th>
                <th className="py-3 px-4 text-left">Return Date</th>
                <th className="py-3 px-4 text-left">Fine</th>
                <th className="py-3 px-4 text-center">Return</th>
              </tr>
            </thead>
            <tbody>
              {borrows.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">
                    No borrow records yet.
                  </td>
                </tr>
              ) : (
                borrows.map((borrow) => (
                  <tr
                    key={borrow._id}
                    className="border-b last:border-b-0 hover:bg-gray-100 transition"
                  >
                    <td className="py-3 px-4">{borrow.book?.title || 'N/A'}</td>
                    <td className="py-3 px-4">{format(new Date(borrow.borrowDate), 'dd MMM yyyy')}</td>
                    <td className="py-3 px-4">{format(new Date(borrow.dueDate), 'dd MMM yyyy')}</td>
                    <td className="py-3 px-4">{borrow.returnDate ? format(new Date(borrow.returnDate), 'dd MMM yyyy') : '-'}</td>
                    <td className="py-3 px-4">{borrow.fine > 0 ? `₹${borrow.fine.toFixed(2)}` : '-'}</td>
                    <td className="py-3 px-4 text-center">
                      {borrow.status === 'Borrowed' ? (
                        <button
                          onClick={() => handleReturn(borrow._id)}
                          className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-600 transition"
                        >
                          Return
                        </button>
                      ) : (
                        <span className="text-gray-500">Returned</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Borrow;
