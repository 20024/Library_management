import React from "react";

const Unauthorized = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-300 z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-2xl text-center">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h2>
        <p className="mb-6">You do not have permission to view this page.</p>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
