import axios from "axios";

const instance = axios.create({
  baseURL: "https://task-management-17b7.onrender.com"
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export default instance;
