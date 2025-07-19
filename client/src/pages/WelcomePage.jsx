import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../App.css";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen container flex flex-col items-center justify-center px-5 text-red-900">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-5xl font-extrabold mb-6 text-right"
      >
        Welcome to Book storm
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="text-lg max-w-xl text-center mb-10 px-8"
      >
        Manage your books, users, and borrowing easily with our professional dashboard.
      </motion.p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/login")}
        className="bg-white text-indigo-700 font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-indigo-100 transition"
      >
        Get Started
      </motion.button>
    </div>
  );
};

export default WelcomePage;
