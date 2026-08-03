import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/lib/constants";
import { ChangePasswordInput } from "@/lib/validators/profile.schema";
import { User } from "@/types/user";

interface ProfileResponse {
  message: string;
  user: User;
}

interface ChangePasswordResponse {
  message: string;
}

export const profileApi = {
  /** GET /profile — Ambil data profil user yang sedang login */
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await apiClient.get<ProfileResponse>(
      API_ENDPOINTS.PROFILE.BASE
    );
    return response.data;
  },

  /** PUT /change-password — Ubah password user yang sedang login */
  changePassword: async (
    data: ChangePasswordInput
  ): Promise<ChangePasswordResponse> => {
    const response = await apiClient.put<ChangePasswordResponse>(
      API_ENDPOINTS.PROFILE.CHANGE_PASSWORD,
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      }
    );
    return response.data;
  },
};
