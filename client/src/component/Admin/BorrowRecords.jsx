import React, { useEffect, useState } from "react";
import axios from "../../api/axios";

const BorrowRecordsTable = () => {
  const [records, setRecords] = useState([]);

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/borrow/recordallBooks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords(res.data);
    } catch (err) {
      console.error("Failed to fetch borrow records:", err);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div className="overflow-x-auto shadow rounded-lg">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="py-2 px-4">Book</th>
            <th className="py-2 px-4">User</th>
            <th className="py-2 px-4">Borrowed</th>
            <th className="py-2 px-4">Due</th>
            <th className="py-2 px-4">Returned</th>
            <th className="py-2 px-4">Fine</th>
            <th className="py-2 px-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record._id} className="text-center border-t">
              <td className="py-2 px-4">{record.bookTitle}</td>
              <td className="py-2 px-4">{record.userName}</td>
              <td className="py-2 px-4">{new Date(record.borrowDate).toLocaleDateString()}</td>
              <td className="py-2 px-4">{new Date(record.dueDate).toLocaleDateString()}</td>
              <td className="py-2 px-4">
                {record.returnDate
                  ? new Date(record.returnDate).toLocaleDateString()
                  : "Not returned"}
              </td>
              <td className="py-2 px-4">₹{record.fine || 0}</td>
              <td className="py-2 px-4">
                {record.returnDate ? (
                  <span className="text-green-600">Returned</span>
                ) : (
                  <span className="text-red-600">Borrowed</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BorrowRecordsTable;
