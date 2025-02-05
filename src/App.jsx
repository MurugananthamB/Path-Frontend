import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


import "./index.css";
import "./App.css";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import UserManagement from "./components/UserManagement/UserManagement";
import Dashboard from "./components/Dashboard/dashboard";
import Reprint from "./components/Home/Reprint";



function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/usermanagement" element={<UserManagement />} />
          <Route path="/reprint" element={<Reprint/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

