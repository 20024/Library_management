import axios from "axios";

const instance = axios.create({
  // baseURL: "http://localhost:4000/api/v1",
  baseURL: "https://library-management-7pxr.vercel.app/api/v1",
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
