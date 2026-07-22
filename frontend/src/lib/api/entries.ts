import { apiClient } from "./client";
import { LogbookEntry, LogbookFormData, ApiResponse } from "@/types/entry";
import { API_ENDPOINTS } from "@/lib/constant";

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

  // POST /logbook
  create: async (data: LogbookFormData): Promise<ApiResponse<LogbookEntry>> => {
    const response = await apiClient.post<ApiResponse<LogbookEntry>>(API_ENDPOINTS.LOGBOOK.BASE, data);
    return response.data;
  },

  // PUT /logbook/:id
  update: async (id: number | string, data: Partial<LogbookFormData>): Promise<ApiResponse<LogbookEntry>> => {
    const response = await apiClient.put<ApiResponse<LogbookEntry>>(API_ENDPOINTS.LOGBOOK.BY_ID(id), data);
    return response.data;
  },

  // DELETE /logbook/:id
  delete: async (id: number | string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(API_ENDPOINTS.LOGBOOK.BY_ID(id));
    return response.data;
  },
};