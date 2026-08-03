import { useState, useCallback } from "react";
import { profileApi } from "@/lib/api/profile";
import { ChangePasswordInput } from "@/lib/validators/profile.schema";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";
import { MESSAGES } from "@/config/messages";
import { User } from "@/types/user";

export const useProfile = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuthStore();
  const { showToast } = useUIStore();

  /** Fetch data profil dari GET /profile */
  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await profileApi.getProfile();
      setProfile(response.user);
      // Sync ke Zustand store agar sidebar/navbar juga terupdate
      setUser(response.user);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const msg = e.response?.data?.message || MESSAGES.ERROR.PROFILE_FETCH_FAILED;
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  /** Submit form change password */
  const changePassword = async (data: ChangePasswordInput) => {
    try {
      setIsSubmitting(true);
      const response = await profileApi.changePassword(data);
      showToast(response.message || MESSAGES.SUCCESS.CHANGE_PASSWORD, "success");
      return true; // Sukses → modal bisa ditutup
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const msg = e.response?.data?.message || MESSAGES.ERROR.CHANGE_PASSWORD_FAILED;
      showToast(msg, "error");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { profile, fetchProfile, changePassword, isLoading, isSubmitting, error };
};
