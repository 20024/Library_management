import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t mt-12">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center text-gray-600 text-sm">
        <p className="mb-2 sm:mb-0">&copy; {new Date().getFullYear()} Library Management System</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-blue-500 transition">Privacy Policy</a>
          <a href="#" className="hover:text-blue-500 transition">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
