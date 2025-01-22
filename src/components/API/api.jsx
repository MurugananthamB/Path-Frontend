import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://path-backend.onrender.com" // Production backend
    : "http://localhost:5000"; // Development backend

export default axios.create({
  baseURL,
});
