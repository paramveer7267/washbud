import axios from "axios";
// https://washbud.onrender.com/api/v1
// http://localhost:5000/api/v1
const axiosInstance = axios.create({
  baseURL: "https://washbud.onrender.com/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
