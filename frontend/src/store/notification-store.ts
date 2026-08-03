import { create } from "zustand";
import { Notification } from "@/types/notification";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;

  /** Set data dari response backend (unreadCount dari server) */
  setNotifications: (items: Notification[], unreadCount: number) => void;

  /** Tandai satu notifikasi sebagai dibaca (optimistic update lokal) */
  markOneRead: (id: number) => void;

  /** Tandai semua notifikasi sebagai dibaca (optimistic update lokal) */
  markAllRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (items, unreadCount) =>
    set({
      notifications: items,
      unreadCount,
    }),

  markOneRead: (id) =>
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, is_read: true } : n
      );
      return {
        notifications: updated,
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
    }),

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
      unreadCount: 0,
    })),
}));
