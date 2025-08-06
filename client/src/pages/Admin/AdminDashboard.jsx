import React, { useEffect, useState } from "react";
// import axios from "../api/axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    books: 0,
    users: 0,
    activeBorrows: 0,
    overdue: 0,
  });

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/admin/dashboard-stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Welcome, Admin</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Books" value={stats.books} color="bg-blue-100" />
        <Card title="Total Users" value={stats.users} color="bg-green-100" />
        <Card title="Active Borrows" value={stats.activeBorrows} color="bg-yellow-100" />
        <Card title="Overdue Books" value={stats.overdue} color="bg-red-100" />
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Recent Activities</h3>
        <ul className="bg-white shadow rounded p-4 space-y-2 text-sm text-gray-700">
          <li> John borrowed "Atomic Habits"</li>
          <li> Sarah returned "Rich Dad Poor Dad"</li>
          <li> Raj is overdue on "Sapiens"</li>
          <li> New user registered: Meera</li>
        </ul>
      </div>
    </div>
  );
};

const Card = ({ title, value, color }) => (
  <div className={`p-4 rounded shadow ${color}`}>
    <h4 className="text-lg font-semibold">{title}</h4>
    <p className="text-2xl">{value}</p>
  </div>
);

export default AdminDashboard;
