import axios from "axios";
import Cookies from "js-cookie";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api";

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      const token = Cookies.get("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      const method = config.method?.toLowerCase();
      if (method && !["get", "head", "options"].includes(method)) {
        let xsrfToken = Cookies.get("XSRF-TOKEN");
        if (!xsrfToken) {
          try {
            const res = await axios.get(`${baseURL}/csrf-token`, { withCredentials: true });
            xsrfToken = res.data.csrfToken;
          } catch (e) {
            console.error("Gagal mengambil CSRF token", e);
          }
        }
        if (xsrfToken && config.headers) {
          config.headers["X-XSRF-TOKEN"] = xsrfToken;
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);