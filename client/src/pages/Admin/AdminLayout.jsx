import React from "react";
import { Outlet, Link } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-3">
          <Link to="/admin/books" className="block hover:underline"> Manage Books</Link>
          <Link to="/admin/borrow-record" className="block hover:underline"> Borrow Records</Link>
          <Link to="/admin/users" className="block hover:underline"> Users</Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Admin</span>
            <button className="text-sm text-blue-600 hover:underline">Logout</button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <AdminDashboard/>
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t text-center py-3 text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Library Management System. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
