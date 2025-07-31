import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserProfile = ({ onClose }) => {
  const [user, setUser] = useState({});
const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <>
      <div className="fixed top-0 right-0 h-full w-1/3 bg-white z-50 shadow-lg rounded-tl-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto">
        <div className="flex justify-between items-center p-5 border-b bg-blue-50 rounded-tl-2xl">
          <div className="flex items-center gap-2">
            {/* <span className="text-blue-600 text-2xl">👤</span> */}
            <h2 className="text-xl font-bold text-blue-700">My Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="text-3xl text-gray-600 hover:text-black"
            title="Close"
          >
            &times;
          </button>
        </div>

        {/* Profile Image */}
        <div className="flex justify-center mt-6">
          <img
            src={user.avatar || "/default-avatar.png"} // fallback image
            alt="User Avatar"
            className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover"
          />
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <div className="text-gray-700">
              <span className="font-semibold text-gray-600">Name:</span>
              <p className="text-lg">{user.name || "abc abc"}</p>
            </div>
            <div className="text-gray-700">
              <span className="font-semibold text-gray-600">Email:</span>
              <p className="text-lg">{user.email || "user@example.com"}</p>
            </div>
            <div className="text-gray-700">
              <span className="font-semibold text-gray-600">Phone:</span>
              <p className="text-lg">{user.phone || "+91-XXXXXXXXXX"}</p>
            </div>
          </div>
        </div>
        <div className="pt-4 ml-5">
          <button
            onClick={() => navigate("/update-password")}
            className="bg-blue-600 text-white cursor-pointer text-sm px-4 py-2 rounded shadow hover:bg-blue-700 transition"
          >
            Change Password
          </button>
        </div>
      </div>

    </>
  );
};

export default UserProfile;
