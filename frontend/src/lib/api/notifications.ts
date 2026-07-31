import { apiClient } from "./client";
import { NotificationListResponse } from "@/types/notification";
import { ApiResponse } from "@/types/api";
import { API_ENDPOINTS } from "@/lib/constants";

export const notificationsApi = {
  /**
   * GET /notifications
   * Response: { success, message, data: { unreadCount, notifications[] } }
   */
  getAll: async (): Promise<ApiResponse<NotificationListResponse>> => {
    const response = await apiClient.get<ApiResponse<NotificationListResponse>>(
      API_ENDPOINTS.NOTIFICATIONS.BASE
    );
    return response.data;
  },

  /** PATCH /notifications/:id/read — Tandai satu notifikasi sebagai dibaca */
  markAsRead: async (id: number | string): Promise<ApiResponse<null>> => {
    const response = await apiClient.patch<ApiResponse<null>>(
      API_ENDPOINTS.NOTIFICATIONS.READ(id)
    );
    return response.data;
  },

  /** PATCH /notifications/read-all — Tandai semua notifikasi sebagai dibaca */
  markAllAsRead: async (): Promise<ApiResponse<null>> => {
    const response = await apiClient.patch<ApiResponse<null>>(
      API_ENDPOINTS.NOTIFICATIONS.READ_ALL
    );
    return response.data;
  },
};
