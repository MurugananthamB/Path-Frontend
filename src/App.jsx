import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import "./index.css";
import "./App.css";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import UserManagement from "./components/UserManagement/UserManagement";
import Dashboard from "./components/Dashboard/dashboard";
import Reprint from "./components/Home/Reprint";
import ReportScreen from "./components/Reports/report";
import Master from "./components/Masters/master";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* ✅ Public Routes */}
          <Route path="/" element={<Login />} />

          {/* ✅ Protected Routes (Only accessible if logged in) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Signup" element={<Signup />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/master" element={<Master />} />
            <Route path="/usermanagement" element={<UserManagement />} />
            <Route path="/reprint" element={<Reprint />} />
            <Route path="/report" element={<ReportScreen />} />
          </Route>

          {/* ✅ Redirect unknown routes to login */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;