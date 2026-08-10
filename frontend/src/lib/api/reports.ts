import { apiClient } from "./client";
import { API_ENDPOINTS } from "@/lib/constants";

export interface ExportPDFParams {
  startDate?: string; // "YYYY-MM-DD", opsional
  endDate?: string;   // "YYYY-MM-DD", opsional
}

export const reportsApi = {
  /**
   * Download logbook PDF dari backend.
   * Jika startDate/endDate tidak diisi -> export semua logbook approved.
   */
  exportLogbookPDF: async (params?: ExportPDFParams): Promise<void> => {
    try {
      const response = await apiClient.get<Blob>(API_ENDPOINTS.LOGBOOK.EXPORT_PDF, {
        responseType: "blob",
        params: {
          ...(params?.startDate && { startDate: params.startDate }),
          ...(params?.endDate && { endDate: params.endDate }),
        },
      });

      // Trigger browser download via URL object
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Laporan_Logbook.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      if (error.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          error.response.data = JSON.parse(text);
        } catch {
          // Jika gagal parse JSON, biarkan error asli
        }
      }
      throw error;
    }
  },
};
