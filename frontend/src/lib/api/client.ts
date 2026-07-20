import axios from "axios";

// Akan mengambil URL dari .env, kalau gagal baru lari ke localhost
const baseURL = process.env.NEXT_PUBLIC_API_URL

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Otomatis pasang Bearer Token sebelum berangkat ke backend
apiClient.interceptors.request.use(
  (config) => {
    // Pastikan kode berjalan di client-side browser, bukan di server Next.js
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);