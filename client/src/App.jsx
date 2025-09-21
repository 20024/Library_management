import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Book";
import Users from "./pages/Users";
import Layout from "./component/Layout";
import WelcomePage from "./pages/WelcomePage";
import Borrow from "./pages/Borrow";
import Logout from "../src/component/Logout";
import Register from "./pages/Register";
import VerifyOTP from "./component/VerifyOTP";
import UpdatePassword from "./pages/UpdatePassword";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminLayout from "./pages/Admin/AdminLayout";
import ManageBooks from "./pages/Admin/ManageBooks";
import ProtectedRoute from "./pages/Admin/ProtectedRoute";
import AdminBorrowRecords from "./pages/Admin/AdminBorrowRecords";
import AdminUsers from "./pages/Admin/AdminUsers";

function App() {
  const isAuthenticated = true;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Layout>
                <Dashboard />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/books"
          element={
            isAuthenticated ? (
              <Layout>
                <Books />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/users"
          element={
            isAuthenticated ? (
              <Layout>
                <Users />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/borrow"
          element={
            isAuthenticated ? (
              <Layout>
                <Borrow />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/update-password"
          element={
            isAuthenticated ? (
              <Layout>
                <UpdatePassword />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/books"
          element={
            isAuthenticated ? (
              <Layout>
                <Books />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />


        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/admin" element={<AdminLayout />} />
        <Route path="/admin/books" element={<ManageBooks />} />
        <Route path="/admin/borrow-record" element={<AdminBorrowRecords />} />
        <Route path="/admin/users" element={<AdminUsers />} />
      </Routes>
    </Router>
  );
}

export default App;
