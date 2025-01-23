import axios from "axios";

const baseURL =
  process.env.REACT_APP_API_URL || "https://path-backend.onrender.com"; // Default to production backend

export default axios.create({
  baseURL,
});
