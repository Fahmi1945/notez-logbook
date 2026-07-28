import { apiClient } from "./client";
import { LogbookEntry } from "@/types/entry";
import { ApiResponse } from "@/types/api";
import { API_ENDPOINTS } from "@/lib/constants";

export type ReviewStatus = "approved" | "rejected";

/**
 * API layer untuk halaman /mentor/review.
 */
export const mentorReviewApi = {
  // GET /mentor/entries — antrean entri berstatus "submitted" dari seluruh menti
  getQueue: async (): Promise<ApiResponse<LogbookEntry[]>> => {
    const response = await apiClient.get<ApiResponse<LogbookEntry[]>>(
      API_ENDPOINTS.MENTOR_REVIEW.QUEUE
    );
    return response.data;
  },

  // GET /mentor/entries/:id — detail 1 entri untuk direview
  getById: async (id: number | string): Promise<ApiResponse<LogbookEntry>> => {
    const response = await apiClient.get<ApiResponse<LogbookEntry>>(
      API_ENDPOINTS.MENTOR_REVIEW.BY_ID(id)
    );
    return response.data;
  },

  // PATCH /mentor/logbook/:id/evaluate — approve & reject pakai endpoint yang sama,
  // dibedakan lewat field "status". "comment" wajib diisi kalau status "rejected".
  evaluate: async (
    id: number | string,
    status: ReviewStatus,
    comment?: string
  ): Promise<ApiResponse<LogbookEntry>> => {
    const payload: Record<string, string> = { status };
    if (comment) {
      payload.comment = comment;
      payload.feedback = comment;
    }

    const response = await apiClient.patch<ApiResponse<LogbookEntry>>(
      API_ENDPOINTS.MENTOR_REVIEW.EVALUATE(id),
      payload
    );
    return response.data;
  },
};