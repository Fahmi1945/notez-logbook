/**
 * Tipe-tipe yang terkait dengan sistem notifikasi.
 * Disesuaikan dengan response body GET /notifications dari backend.
 */

/** Objek notifikasi dari backend */
export interface Notification {
  id: number;
  user_id: number;
  message: string;
  is_read: boolean;
  is_read_date: string | null; // ISO datetime string
  mentorships_id: number | null;
  logbook_id: number | null;
  created_at: string; // ISO datetime string
}

/** Wrapper response khusus GET /notifications */
export interface NotificationListResponse {
  unreadCount: number;
  notifications: Notification[];
}
