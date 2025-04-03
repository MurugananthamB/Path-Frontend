import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate(); // ✅ Fix: useNavigate should be inside the component

  // ✅ Handle logout
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <div className="dashboard-container">
      {/* ✅ Logout Button */}
      <div className="logout-btn-container">
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="dashboard-header">
        <h1>Welcome to the Pathology Application</h1>
      </div>

      <div className="dashboard-buttons">
        <Link to="/">
          <button className="dashboard-btn login-btn">Login</button>
        </Link>
        <Link to="/signup">
          <button className="dashboard-btn signup-btn">Signup</button>
        </Link>
      </div>

      <br />

      <div className="flex flex-col items-center space-y-4">
        {/* ✅ User Management Button */}
        <Link to="/master">
          <button className="dashboard-btn usermanagement-btn">Masters</button>
        </Link>

        {/* ✅ User Management Button */}
        <Link to="/usermanagement">
          <button className="dashboard-btn usermanagement-btn">
            User Management
          </button>
        </Link>
      </div>

      <div className="dashboard-footer">
        <p>© 2025 APH IT . All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default Dashboard;
