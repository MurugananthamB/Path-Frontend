import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import "./index.css";
import "./App.css";

// Lazy-loaded components
const Home = lazy(() => import("./components/Home/Home"));
const Login = lazy(() => import("./components/Login/Login"));
const Signup = lazy(() => import("./components/Signup/Signup"));
const UserManagement = lazy(() =>
  import("./components/UserManagement/UserManagement")
);
const Dashboard = lazy(() => import("./components/Dashboard/dashboard"));
const Reprint = lazy(() => import("./components/Home/Reprint"));
const ReportScreen = lazy(() => import("./components/Reports/report"));
const Master = lazy(() => import("./components/Masters/Master"));
const ProtectedRoute = lazy(() =>
  import("./components/ProtectedRoute/ProtectedRoute")
);

function App() {
  return (
    <div className="App">
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {/* ✅ Public Routes */}
            <Route path="/" element={<Login />} />

            {/* ✅ Protected Routes */}
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
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
