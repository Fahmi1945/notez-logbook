import axios from "axios";
import Cookies from "js-cookie";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api";

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = Cookies.get("token");
      if (token && config.headers)
        config.headers.Authorization = `Bearer ${token}`;
      
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);