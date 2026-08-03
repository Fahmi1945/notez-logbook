import { useState, useCallback, useEffect, useRef } from "react";
import { notificationsApi } from "@/lib/api/notifications";
import { useNotificationStore } from "@/store/notification-store";
import { useUIStore } from "@/store/ui-store";

/** Interval polling dalam milidetik (30 detik) */
const POLLING_INTERVAL = 30_000;

export function useNotifications() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isFirstFetch = useRef(true);

  const { notifications, unreadCount, setNotifications, markOneRead, markAllRead } =
    useNotificationStore();
  const { showToast } = useUIStore();

  /** Ambil semua notifikasi dari server */
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await notificationsApi.getAll();
      const { notifications: items, unreadCount: count } = res.data;
      setNotifications(items || [], count ?? 0);
      setError(null);

      isFirstFetch.current = false;
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const msg = e.response?.data?.message || "Gagal memuat notifikasi.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [setNotifications]);

  /** Polling: fetch ulang setiap POLLING_INTERVAL ms */
  useEffect(() => {
    let isMounted = true;

    const doFetch = async () => {
      if (isMounted) {
        await fetchNotifications();
      }
    };

    // Fetch pertama kali saat mount
    doFetch();

    const intervalId = setInterval(() => {
      if (isMounted) {
        doFetch();
      }
    }, POLLING_INTERVAL);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [fetchNotifications]);

  /** Tandai satu notifikasi sebagai dibaca */
  const handleMarkAsRead = useCallback(
    async (id: number) => {
      try {
        markOneRead(id); // Optimistic update
        await notificationsApi.markAsRead(id);
      } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } } };
        const msg = e.response?.data?.message || "Gagal menandai notifikasi.";
        showToast(msg, "error");
        // Rollback: re-fetch dari server
        await fetchNotifications();
      }
    },
    [markOneRead, showToast, fetchNotifications]
  );

  /** Tandai semua notifikasi sebagai dibaca */
  const handleMarkAllAsRead = useCallback(async () => {
    try {
      markAllRead(); // Optimistic update
      await notificationsApi.markAllAsRead();
      showToast("Semua notifikasi ditandai dibaca.", "success");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const msg = e.response?.data?.message || "Gagal menandai semua notifikasi.";
      showToast(msg, "error");
      // Rollback: re-fetch dari server
      await fetchNotifications();
    }
  }, [markAllRead, showToast, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    handleMarkAsRead,
    handleMarkAllAsRead,
  };
}
