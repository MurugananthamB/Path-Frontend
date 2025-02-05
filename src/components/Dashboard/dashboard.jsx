import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome to the Pathology Application</h1>
      </div>

      <div className="dashboard-buttons">
        <Link to="/login">
          <button className="dashboard-btn login-btn">Login</button>
        </Link>
        <Link to="/signup">
          <button className="dashboard-btn signup-btn">Signup</button>
        </Link>
      </div>
      <br></br>

      {/* New User Management Button */}
      <Link to="/usermanagement">
        <button className="dashboard-btn usermanagement-btn">
          User Management
        </button>
      </Link>

      <div className="dashboard-footer">
        <p>© 2025 Company Name. All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default Dashboard;
