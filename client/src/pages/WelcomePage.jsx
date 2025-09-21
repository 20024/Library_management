import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../App.css";
import Footer from "../component/Footer";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col welcomecontainer homepage">
      {/* Main content */}
      <div className="flex-grow container flex flex-col items-center justify-center px-5 text-black">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl font-extrabold mb-6 text-right"
        >
          Welcome to Book Storm
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-lg max-w-xl text-center mb-10 px-8"
        >
          Every book is a doorway to a new world — manage your library, connect with readers, and unlock countless adventures.
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

      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full">
        <Footer />
      </motion.footer>
    </div>
  );
};

export default WelcomePage;
