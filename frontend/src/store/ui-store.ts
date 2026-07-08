import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info';

interface UIState {
  toastMessage: string | null;
  toastType: ToastType;
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  toastMessage: null,
  toastType: 'info',
  showToast: (message, type = 'info') => {
    set({ toastMessage: message, toastType: type });
    // Otomatis hilang setelah 3 detik
    setTimeout(() => {
      set({ toastMessage: null });
    }, 3000);
  },
  hideToast: () => set({ toastMessage: null }),
}));