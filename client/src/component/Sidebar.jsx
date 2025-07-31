import React from "react";
import { Link, NavLink } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/books", label: "Books" },
    { path: "/borrow-book", label: "My Borrow" },
  ];

  return (
    <div className="bg-white shadow h-screen p-4 w-52">
      <Link to={"/dashboard"}><h2 className="text-xl font-bold mb-6"> Book Storm</h2></Link>
      <nav className="flex flex-col space-y-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `p-2 rounded hover:bg-blue-300 ${
                isActive ? "bg-blue-500 text-white" : "text-gray-700"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
