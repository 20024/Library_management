import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';

const AdminBorrowRecords = () => {
  const [borrowers, setBorrowers] = useState([]);
  const [error, setError] = useState('');

  const fetchBorrowers = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post('/borrow/recordallBooks',{}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBorrowers(data.borrowers);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch borrowers.');
    }
  };

  useEffect(() => {
    fetchBorrowers();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">Borrower Details</h1>
      {error && <p className="text-red-600 text-center">{error}</p>}
      <div className="overflow-auto bg-white rounded shadow border border-gray-300">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-5 text-left">User Name</th>
              <th className="py-3 px-5 text-left">Email</th>
              <th className="py-3 px-5 text-left">Book Title</th>
              <th className="py-3 px-5 text-left">Borrow Date</th>
              <th className="py-3 px-5 text-left">Return Date</th>
              <th className="py-3 px-5 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {borrowers.length ? (
              borrowers.map((borrow) => (
                <tr key={borrow._id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-5">{borrow.user?.name || 'N/A'}</td>
                  <td className="py-4 px-5">{borrow.user?.email || 'N/A'}</td>
                  <td className="py-4 px-5">{borrow.book?.title || 'N/A'}</td>
                  <td className="py-4 px-5">
                    {new Date(borrow.borrowDate).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-5">
                    {borrow.returnDate
                      ? new Date(borrow.returnDate).toLocaleDateString()
                      : 'Not returned'}
                  </td>
                  <td className="py-4 px-5 font-semibold">
                    {borrow.returnDate ? (
                      <span className="text-green-600">Returned</span>
                    ) : (
                      <span className="text-red-600">Borrowed</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-12 text-gray-600 font-semibold">
                  No borrower data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBorrowRecords;
