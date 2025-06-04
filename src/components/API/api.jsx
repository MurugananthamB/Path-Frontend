import axios from "axios";

const baseURL = "http://192.168.103.158:5001";

// import.meta.env.VITE_API_URL; // Updated to use Render backend

//192.168.103.158:5001

// https://path-backend.onrender.com

 export default axios.create({
  baseURL,
});
