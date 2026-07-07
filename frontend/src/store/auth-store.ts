import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/user";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      // Fungsi untuk menyimpan user saat login sukses
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      // Fungsi untuk menghapus user saat logout
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "user-data",
    }
  )
);