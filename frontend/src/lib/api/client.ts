import axios from "axios";
import Cookies from "js-cookie"; // Pastikan import js-cookie

const baseURL = process.env.NEXT_PUBLIC_API_URL; //[cite: 5]

export const apiClient = axios.create({
  baseURL, //[cite: 5]
  headers: {
    "Content-Type": "application/json", //[cite: 5]
  },
});

// Request Interceptor: Otomatis pasang Bearer Token sebelum berangkat ke backend
apiClient.interceptors.request.use(
  (config) => {
    // Pastikan kode berjalan di client-side browser, bukan di server Next.js
    if (typeof window !== "undefined") { //[cite: 5]
      const token = Cookies.get("token"); // Ambil dari Cookies, bukan localStorage
      if (token && config.headers) { //[cite: 5]
        config.headers.Authorization = `Bearer ${token}`; //[cite: 5]
      }
    }
    return config; //[cite: 5]
  },
  (error) => {
    return Promise.reject(error); //[cite: 5]
  }
);