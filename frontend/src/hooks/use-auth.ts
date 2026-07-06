import { useState } from "react";
import { apiClient } from "@/lib/api/client";
import { LoginInput, RegisterInput } from "@/lib/validators/auth.schema";
import { MESSAGES } from "@/config/constants";
import { useUIStore } from "@/store/ui-store";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useUIStore(); // Panggil Toast dari Zustand

  const login = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post("/api/auth/login", data);
      const responseData = response.data;

      if (responseData.token) {
        // 1. Simpan di localStorage (untuk axios interceptor)
        localStorage.setItem("token", responseData.token);
        
        // 2. Simpan di Cookies (wajib untuk Middleware Next.js)
        document.cookie = `token=${responseData.token}; path=/; max-age=86400; SameSite=Strict`;
      }

      // Ganti alert dengan Toast Success
      showToast(responseData.message || MESSAGES.SUCCESS.LOGIN, "success");

      setTimeout(() => {
        const role = responseData.user?.role;
        window.location.href = role === "mentor" ? "/mentor/dashboard" : "/dashboard";
      }, 1000); // Beri jeda 1 detik agar animasi toast terlihat sebelum pindah halaman
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || MESSAGES.ERROR.LOGIN_FAILED;
      // Ganti alert dengan Toast Error
      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post("/api/auth/register", data);
      showToast(response.data.message || MESSAGES.SUCCESS.REGISTER, "success");
      
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || MESSAGES.ERROR.REGISTER_FAILED;
      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    login, 
    register, 
    isLoading 
  };
};