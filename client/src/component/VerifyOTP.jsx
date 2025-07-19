import React, { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const VerifyOTP = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !otp) {
      setError("Please enter both email and OTP");
      return;
    }

    try {
      await axios.post("auth/verify-otp", { email: email.trim(), otp: otp.trim() });
      setSuccess(response.data.message || "OTP verified successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Verification failed. Please try again."
      );
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-10 border rounded shadow">
      <h2 className="text-2xl mb-4 font-semibold">Verify Your OTP</h2>

      {error && <p className="text-red-600 mb-3">{error}</p>}
      {success && <p className="text-green-600 mb-3">{success}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 mb-3 w-full"
        />

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          className="border p-2 mb-3 w-full"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded w-full"
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default VerifyOTP;
