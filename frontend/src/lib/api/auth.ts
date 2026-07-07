import { apiClient } from "./client";
import { LoginInput, RegisterInput } from "@/lib/validators/auth.schema";
import { AuthResponse } from "@/types/api";

export const authApi = {
  // Fungsi khusus untuk Login
  login: async (data: LoginInput) => {
    const response = await apiClient.post<AuthResponse>("/api/auth/login", data);
    return response.data;
  },
  
  // Fungsi khusus untuk Register
  register: async (data: RegisterInput) => {
    const response = await apiClient.post<AuthResponse>("/api/auth/register", data);
    return response.data;
  }
};