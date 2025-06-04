import axios from "axios";

const baseURL = "http://localhost:10000";

// import.meta.env.VITE_API_URL; // Updated to use Render backend


// https://path-backend.onrender.com

export default axios.create({
  baseURL,
});
