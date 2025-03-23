import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL; // Updated to use Render backend

//"http://localhost:5000"
// https://path-backend.onrender.com

export default axios.create({
  baseURL,
});
