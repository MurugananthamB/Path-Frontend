import axios from "axios";

const baseURL = "https://path-backend.onrender.com"; // Updated to use Render backend

export default axios.create({
  baseURL,
});
