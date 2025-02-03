import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

const Login = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employeeId || !password) {
      setError("Please enter both Employee ID and Password.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/login", {
        employeeId,
        password,
      });

      // Store login data in localStorage
      localStorage.setItem("employeeData", JSON.stringify(response.data));

      setSuccess(true);
      setError(null);

      navigate("/pathologylabel");
    } catch (err) {
      console.error("Error:", err.response ? err.response.data : err.message);
      let errorMessage = "An error occurred while logging in.";

      if (err.response) {
        errorMessage = err.response.data.message || err.message;
      } else if (err.request) {
        errorMessage =
          "No response from the server. Please check your network connection.";
      }

      setError(errorMessage);
      setSuccess(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
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
          <button type="submit" className="login-btn">
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
