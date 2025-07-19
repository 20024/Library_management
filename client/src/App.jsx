import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Book";
import Users from "./pages/Users";
import Layout from "./component/Layout";
import WelcomePage from "./pages/WelcomePage";
import Borrow from "./pages/Borrow";
import Logout from "./pages/Logout";
import Register from "./pages/Register";
import VerifyOTP from "./component/VerifyOTP";

function App() {
  const isAuthenticated = true; // Replace with your auth logic

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

        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/logout" element={<Logout />} />

      </Routes>
    </Router>
  );
}

export default App;
