import React, { useState } from "react";
import api from "../API/api";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    password: "",
    passwordConfirmation: "",
  });
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

    const { name, employeeId, password, passwordConfirmation } = formData;

    // Client-side validation for empty fields
    if (!name || !employeeId || !password || !passwordConfirmation) {
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
      // Enhanced error handling for different scenarios
      console.error("Error:", err.response ? err.response.data : err.message);

      let errorMessage = "An error occurred while submitting the form.";

      // If error response exists from backend, use that message
      if (err.response) {
        errorMessage = err.response.data.message || err.message;
      } else if (err.request) {
        // No response from the server, network issues
        errorMessage =
          "No response from the server. Please check your network connection.";
      } else {
        // Generic error handling for unexpected issues
        errorMessage =
          err.message || "Something went wrong. Please try again later.";
      }

      setError(errorMessage); // Display the error message to the user
      setSuccess(false); // Reset success flag
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
              name="name"
              value={formData.name}
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

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password:</label>
            <input
              type="password"
              name="passwordConfirmation"
              value={formData.passwordConfirmation}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="signup-btn">
            Signup
          </button>
        </form>
        {success && <p className="success-msg">Signup successful!</p>}{" "}
        {/* Show success message */}
        {error && <p className="error-msg">{error}</p>}{" "}
        {/* Show error message */}
      </div>
    </div>
  );
};

export default Signup;
