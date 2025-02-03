import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


import "./index.css";
import "./App.css";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Signup from "./components/Singup/Signup";
import UserManagement from "./components/User Management/usermanagment";


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/management" element={<UserManagement />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

