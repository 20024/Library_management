import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const links = [
    { to: "/dashboard", label: "🏠 Dashboard" },
    { to: "/books", label: "📚 Books" },
    { to: "/users", label: "👥 Users" },
    { to: "/borrowed", label: "🔁 Borrowed" },
    { to: "/logout", label: "🚪 Logout" },
  ];

  return (
    <div className="w-64 min-h-screen bg-pink-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-6 text-center"> Admin Pannel</h1>
      <nav className="flex flex-col gap-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `px-4 py-2 rounded hover:bg-blue-700 ${
                isActive ? "bg-black font-semibold" : ""
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
