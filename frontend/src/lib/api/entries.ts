import { apiClient } from "./client";
import { LogbookEntry } from "@/types/entry";
import { ApiResponse } from "@/types/api";
import { EntryFormInput } from "@/lib/validators/entry.schema";
import { API_ENDPOINTS } from "@/lib/constants";

export const entriesApi = {
  // GET /logbook
  getAll: async (): Promise<ApiResponse<LogbookEntry[]>> => {
    const response = await apiClient.get<ApiResponse<LogbookEntry[]>>(API_ENDPOINTS.LOGBOOK.BASE);
    return response.data;
  },

  // GET /logbook/:id
  getById: async (id: number | string): Promise<ApiResponse<LogbookEntry>> => {
    const response = await apiClient.get<ApiResponse<LogbookEntry>>(API_ENDPOINTS.LOGBOOK.BY_ID(id));
    return response.data;
  },

  // POST /logbook (multipart/form-data for attachments)
  create: async (data: EntryFormInput, files?: File[]): Promise<ApiResponse<LogbookEntry>> => {
    const formData = new FormData();
    formData.append("activity_date", data.activity_date);
    formData.append("title", data.title);
    formData.append("description", data.description);
    if (data.obstacles) formData.append("obstacles", data.obstacles);
    if (files && files.length > 0) {
      files.forEach((file) => formData.append("attachments", file));
    }
    const response = await apiClient.post<ApiResponse<LogbookEntry>>(
      API_ENDPOINTS.LOGBOOK.BASE,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  },

  // PUT /logbook/:id (multipart/form-data for attachments)
  update: async (id: number | string, data: Partial<EntryFormInput> & { remove_attachment?: boolean }, files?: File[]): Promise<ApiResponse<LogbookEntry>> => {
    const formData = new FormData();
    if (data.activity_date) formData.append("activity_date", data.activity_date);
    if (data.title) formData.append("title", data.title);
    if (data.description) formData.append("description", data.description);
    if (data.obstacles !== undefined) formData.append("obstacles", data.obstacles ?? "");
    if (data.remove_attachment) formData.append("remove_attachment", "true");
    if (files && files.length > 0) {
      files.forEach((file) => formData.append("attachments", file));
    }
    const response = await apiClient.put<ApiResponse<LogbookEntry>>(
      API_ENDPOINTS.LOGBOOK.BY_ID(id),
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  },

  // DELETE /logbook/:id
  delete: async (id: number | string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(API_ENDPOINTS.LOGBOOK.BY_ID(id));
    return response.data;
  },

  // PATCH /logbook/submit/:id
  submit: async (id: number | string): Promise<ApiResponse<LogbookEntry>> => {
    const response = await fetch(`/api/proxy/logbook/submit/${id}`, {
      method: "PATCH",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Gagal submit logbook.");
    return data;
  },
};