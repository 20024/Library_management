import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserProfile = ({ onClose }) => {
  const [user, setUser] = useState({});
  const [editingPhone, setEditingPhone] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handlePhoneSave = () => {
    const updatedUser = { ...user, phone: newPhone };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setEditingPhone(false);
  };

  return (
    <div className="fixed top-0 right-0 h-full w-1/3 bg-white z-50 shadow-lg rounded-tl-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center p-5 border-b bg-blue-50 rounded-tl-2xl">
        <h2 className="text-xl font-bold text-blue-700">My Profile</h2>
        <button
          onClick={onClose}
          className="text-3xl text-gray-600 hover:text-black"
          title="Close"
        >
          &times;
        </button>
      </div>

      {/* Avatar */}
      <div className="flex justify-center mt-6">
        <img
          src={user.avatar || "/default-avatar.png"}
          alt="User Avatar"
          className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover"
        />
      </div>

      {/* User Info */}
      <div className="p-6 space-y-6">
        <div className="space-y-3 text-gray-700">
          <div>
            <span className="font-semibold text-gray-600">Name:</span>
            <p className="text-lg">{user.name || "abc abc"}</p>
          </div>

          <div>
            <span className="font-semibold text-gray-600">Email:</span>
            <p className="text-lg">{user.email || "user@example.com"}</p>
          </div>

          <div>
            <span className="font-semibold text-gray-600">Phone:</span>
            <p className="text-lg">{user.phone || "+91-XXXXXXXXXX"}</p>

            {!editingPhone ? (
              <button
                onClick={() => {
                  setEditingPhone(true);
                  setNewPhone(user.phone || "");
                }}
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                {user.phone ? "Edit Number" : "Add Number"}
              </button>
            ) : (
              <div className="mt-2 space-y-2">
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 w-full"
                  placeholder="Enter new number"
                />
                <button
                  onClick={handlePhoneSave}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                >
                  Save
                </button>
              </div>
            )}
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
  );
};

export default UserProfile;
