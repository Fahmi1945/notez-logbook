import { useState } from "react";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/store/auth-store";
import { LoginInput, RegisterInput } from "@/lib/validators/auth.schema";
import { MESSAGES } from "@/config/constants";
import { useUIStore } from "@/store/ui-store";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Tarik state dan fungsi dari Zustand
  const { user, setUser, logout } = useAuthStore();
  const { showToast } = useUIStore();

  const login = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      // Memanggil fungsi dari lib/api/auth.ts
      const responseData = await authApi.login(data);

      if (responseData.token) {
        localStorage.setItem("token", responseData.token);
        document.cookie = `token=${responseData.token}; path=/; max-age=86400; SameSite=Strict`;
        
        // Simpan user via Zustand (otomatis masuk LocalStorage berkat persist)
        if (responseData.user) {
          setUser(responseData.user);
        }
      }

      showToast(responseData.message || MESSAGES.SUCCESS.LOGIN, "success");

      setTimeout(() => {
        const role = responseData.user?.role;
        window.location.href = role === "mentor" ? "/mentor/dashboard" : "/dashboard";
      }, 1000); 
      
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage = err.response?.data?.message || MESSAGES.ERROR.LOGIN_FAILED;
      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
      const responseData = await authApi.register(data);
      showToast(responseData.message || MESSAGES.SUCCESS.REGISTER, "success");
      
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
      
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage = err.response?.data?.message || MESSAGES.ERROR.REGISTER_FAILED;
      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Kita juga mengekspor fungsi logout agar mudah dipakai di komponen Navbar/Sidebar
  return { 
    user, 
    login, 
    register, 
    logout,
    isLoading 
  };
};