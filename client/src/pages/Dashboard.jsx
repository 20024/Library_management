import React, { useEffect, useState } from "react";
import axios from "../api/axios";

const Dashboard = () => {
  const [data, setData] = useState({
    books: 0,
    users: 0,
    activeBorrows: 0,
    overdue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    try {
      const storedUserStr = localStorage.getItem("user");
      if (storedUserStr) {
        const storedUser = JSON.parse(storedUserStr);
        if (storedUser?.name) {
          setUserName(storedUser.name);
        }
      }
    } catch (err) {
      console.error("User parse error:", err);
    }

    // Greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    // Fetch dashboard data
    const fetchStats = async () => {
      try {
        const [booksRes, usersRes, borrowsRes] = await Promise.all([
          axios.get("/book"),
          axios.get("/user"),
          axios.get("/borrow"),
        ]);

        const books = booksRes?.data?.books?.length || 0;
        const users = usersRes?.data?.users?.length || 0;

        const borrows = borrowsRes?.data?.data || [];
        const activeBorrows = borrows.filter((b) => b.status !== "Returned").length;
        const overdue = borrows.filter((b) => {
          const due = new Date(b.dueDate);
          return !b.returnDate && due < new Date();
        }).length;

        setData({ books, users, activeBorrows, overdue });
        setLoading(false);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading Dashboard...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">📊 Dashboard</h1>
      <p className="text-lg text-gray-700 mb-6">
        {greeting}, <span className="font-semibold text-blue-700">{userName}</span>!
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard title="Total Books" count={data.books} />
        <DashboardCard title="Total Users" count={data.users} />
        <DashboardCard title="Active Borrows" count={data.activeBorrows} />
        <DashboardCard title="Overdue Returns" count={data.overdue} />
      </div>
    </div>
  );
};

const DashboardCard = ({ title, count }) => (
  <div className="bg-white shadow rounded p-6 text-center">
    <h2 className="text-lg font-semibold mb-2">{title}</h2>
    <p className="text-3xl font-bold text-blue-600">{count}</p>
  </div>
);

export default Dashboard;
