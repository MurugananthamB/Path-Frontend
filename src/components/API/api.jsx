import axios from "axios";

const baseURL = "http://localhost:5000/"; // Production backend URL

export default axios.create({
  baseURL,
});
