import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👁 Import icons
import api from "../API/api";

const Login = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁 Password visibility toggle
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ Hardcoded Admin Credentials
  const ADMIN_CREDENTIALS = {
    employeeId: "admin",
    password: "path@mapims2025",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employeeId || !password) {
      setError("Please enter both Employee ID and Password.");
      return;
    }

    setLoading(true);

    try {
      // ✅ Hardcoded Admin Login Check
      if (
        employeeId === ADMIN_CREDENTIALS.employeeId &&
        password === ADMIN_CREDENTIALS.password
      ) {
        localStorage.setItem("userId", "admin");
        localStorage.setItem("role", "admin");
        sessionStorage.setItem("userId", "admin");

        setSuccess(true);
        setError(null);
        setLoading(false);

        navigate("/Dashboard"); // ✅ Redirect Admin to Dashboard
        return;
      }

      // ✅ Normal Login Flow (API Call)
      const response = await api.post("/api/auth/login", {
        employeeId,
        password,
      });

      if (response.data && response.data.userId) {
        const { userId, role } = response.data;

        localStorage.setItem("userId", userId);
        sessionStorage.setItem("userId", userId);
        localStorage.setItem("role", role);

        setSuccess(true);
        setError(null);
        setLoading(false);

        // ✅ Redirect based on user role
        if (role === "admin") {
          navigate("/Dashboard");
        } else {
          navigate("/Home");
        }
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>
          <b>Login</b>
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Employee ID:</label>
            <input
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="Enter Employee ID"
              required
            />
          </div>
          <div className="form-group" style={{ position: "relative" }}>
            <label>Password:</label>
            <input
              type={showPassword ? "text" : "password"} // 👁 Toggle visibility
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              required
              style={{ width: "100%", paddingRight: "40px" }}
            />
            {/* 👁 Password visibility toggle button */}
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "45px",
                cursor: "pointer",
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: "#4CAF50",
              padding: "10px 15px",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              width: "100%",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#45a049")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#4CAF50")}
            disabled={loading} // ✅ Disable button while logging in
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {success && <p style={{ color: "green" }}>Login successful!</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};

export default Login;
