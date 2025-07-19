import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50">
      <div className="bg-white rounded-xl p-8 max-w-sm w-full shadow-xl text-center">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Are you sure you want to logout?</h2>
        <div className="flex justify-center gap-6">
          <button
            onClick={handleConfirm}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Yes
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
