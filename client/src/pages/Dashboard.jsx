import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { IoMdLogOut } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import UserProfile from "../component/UserProfile";

const Dashboard = () => {
  const [data, setData] = useState({
    books: 0,
    users: 0,
    activeBorrows: 0,
    overdue: 0,
  });
  const [showUserModal, setShowUserModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [greeting, setGreeting] = useState("");

  const navigate = useNavigate();

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

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

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
        const activeBorrows = borrows.filter(b => b.status !== "Returned").length;
        const overdue = borrows.filter(b => {
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
    <div className="p-6 relative min-h-screen">
      <button
        onClick={() => setShowUserModal(true)}
        className="fixed top-5 right-24 cursor-pointer text-black text-2xl hover:text-blue-800 transition"
        title="Profile"
      >
        <FaUserCircle />
      </button>

      <button
        onClick={() => navigate("/logout")}
        className="fixed top-5 right-10 text-red-600 text-2xl hover:text-red-800 transition"
        title="Logout"
      >
        <IoMdLogOut />
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">📊 Dashboard</h1>
        <p className="text-lg text-gray-700">
          {greeting}, <span className="font-semibold text-blue-700">{userName}</span>!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard title="Total Books" count={data.books} color="bg-indigo-300" />
        <DashboardCard title="Active Borrows" count={data.activeBorrows} color="bg-yellow-300" />
        <DashboardCard title="Overdue Returns" count={data.overdue} color="bg-rose-300" />
      </div>

      {showUserModal && <UserProfile onClose={() => setShowUserModal(false)} />}
    </div>
  );
};

const DashboardCard = ({ title, count, color }) => (
  <div className={`p-6 rounded-lg shadow-md text-black ${color}`}>
    <h2 className="text-lg font-semibold mb-2">{title}</h2>
    <p className="text-3xl font-bold">{count}</p>
  </div>
);

export default Dashboard;
