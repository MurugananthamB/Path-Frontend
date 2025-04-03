import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👁 Import icons
import api from "../API/api";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    employeeId: "",
    password: "",
    passwordConfirmation: "",
  });

  const [showPassword, setShowPassword] = useState(false); // 👁 Toggle for password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // 👁 Toggle for confirm password
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Handle changes in form input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstName, employeeId, password, passwordConfirmation } = formData;

    // Client-side validation for empty fields
    if (!firstName || !employeeId || !password || !passwordConfirmation) {
      setError("All fields are required.");
      return;
    }

    // Client-side validation for password matching
    if (password !== passwordConfirmation) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Send POST request to backend
      const response = await api.post("/api/auth/signup", formData);

      // If signup is successful
      console.log("Response:", response.data);
      setSuccess(true); // Set success to true to show a success message or redirect
      setError(null); // Reset any previous errors
    } catch (err) {
      console.error("Error:", err.response ? err.response.data : err.message);

      let errorMessage = "An error occurred while submitting the form.";

      if (err.response) {
        errorMessage = err.response.data.message || err.message;
      } else if (err.request) {
        errorMessage =
          "No response from the server. Please check your network connection.";
      } else {
        errorMessage =
          err.message || "Something went wrong. Please try again later.";
      }

      setError(errorMessage);
      setSuccess(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Signup</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Employee ID:</label>
            <input
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password Field with Visibility Toggle */}
          <div className="form-group" style={{ position: "relative" }}>
            <label>Password:</label>
            <input
              type={showPassword ? "text" : "password"} // 👁 Toggle visibility
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ width: "100%", paddingRight: "40px" }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "40px",
                cursor: "pointer",
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Confirm Password Field with Visibility Toggle */}
          <div className="form-group" style={{ position: "relative" }}>
            <label>Confirm Password:</label>
            <input
              type={showConfirmPassword ? "text" : "password"} // 👁 Toggle visibility
              name="passwordConfirmation"
              value={formData.passwordConfirmation}
              onChange={handleChange}
              required
              style={{ width: "100%", paddingRight: "40px" }}
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "40px",
                cursor: "pointer",
              }}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit" className="signup-btn">
            Signup
          </button>
        </form>
        {success && <p className="success-msg">Signup successful!</p>}
        {error && <p className="error-msg">{error}</p>}
      </div>
    </div>
  );
};

export default Signup;
