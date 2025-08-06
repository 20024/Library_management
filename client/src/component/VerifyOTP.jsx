import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const VerifyOTP = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailFromURL = params.get("email");
    if (emailFromURL) setEmail(emailFromURL);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !otp) {
      setError("Please enter both email and OTP");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("auth/verify-otp", {
        email: email.trim(),
        otp: otp.trim(),
      });

      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative max-w-md mx-auto p-4 mt-10 border rounded shadow">
      <h2 className="text-2xl mb-4 font-semibold">Verify Your OTP</h2>

      {error && <p className="text-red-600 mb-3">{error}</p>}

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
          disabled={loading}
          className={`p-2 rounded w-full ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white"}`}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-xl text-center w-80">
            <h2 className="text-xl font-semibold text-green-600 mb-2">
               Account Verified!
            </h2>
            <p className="text-gray-700">Thank you for resgister.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyOTP;
