import { apiClient } from "./client";
import { LoginInput, RegisterInput } from "@/lib/validators/auth.schema";
import { AuthResponse } from "@/types/api";
import { API_ENDPOINTS } from "@/lib/constant";

export const authApi = {
  // Fungsi khusus untuk Login
  login: async (data: LoginInput) => {
    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
    return response.data;
  },
  
  // Fungsi khusus untuk Register
  register: async (data: RegisterInput) => {
    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  }
};