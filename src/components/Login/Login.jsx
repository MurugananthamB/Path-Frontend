import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import api from "../API/api";

const Login = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!employeeId || !password) {
    setError("Please enter both Employee ID and Password.");
    return;
  }

  setLoading(true);

  try {
    const response = await api.post("/api/auth/login", {
      employeeId,
      password,
    });

    if (response.data && response.data.userId) {
      localStorage.setItem("userId", response.data.userId);
      sessionStorage.setItem("userId", response.data.userId);

      setSuccess(true);
      setError(null);
      setLoading(false);

      navigate("/Home");
    } else {
      throw new Error("Invalid response from server.");
    }
  } catch (err) {
    console.error("Login error:", err.response?.data || err.message);

    // ✅ Ensure error message is set and loading is stopped
    setError(err.response?.data?.message || "Login failed. Please try again.");
    setLoading(false); // ✅ Prevent infinite freeze

    // Optional: Reload page only if necessary
    // window.location.reload();
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
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              required
            />
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
            Login
          </button>
        </form>
        {success && <p style={{ color: "green" }}>Login successful!</p>}{" "}
        {/* Show success message */}
        {error && <p style={{ color: "red" }}>{error}</p>}{" "}
        {/* Show error message */}
      </div>
    </div>
  );
};

export default Login;
