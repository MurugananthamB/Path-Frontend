import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


import "./index.css";
import "./App.css";
import Home from "./components/Home/Home";


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path="/" element={<Home />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;

