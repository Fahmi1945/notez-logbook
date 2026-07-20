import Cookies from "js-cookie";
import { LogbookEntry, LogbookFormData, ApiResponse } from "@/types/entry";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper function untuk setup header & token otomatis
const getHeaders = () => {
  const token = Cookies.get("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const entriesApi = {
  // GET /logbook
  getAll: async (): Promise<ApiResponse<LogbookEntry[]>> => {
    const response = await fetch(`${API_URL}/logbook`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Gagal mengambil data logbook");
    return response.json();
  },

  // GET /logbook/:id
  getById: async (id: number | string): Promise<ApiResponse<LogbookEntry>> => {
    const response = await fetch(`${API_URL}/logbook/${id}`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Gagal mengambil detail logbook");
    return response.json();
  },

  // POST /logbook
  create: async (data: LogbookFormData): Promise<ApiResponse<LogbookEntry>> => {
    const response = await fetch(`${API_URL}/logbook`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Gagal membuat logbook baru");
    return response.json();
  },

  // PUT /logbook/:id
  update: async (id: number | string, data: Partial<LogbookFormData>): Promise<ApiResponse<LogbookEntry>> => {
    const response = await fetch(`${API_URL}/logbook/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Gagal memperbarui logbook");
    return response.json();
  },

  // DELETE /logbook/:id
  delete: async (id: number | string): Promise<ApiResponse<null>> => {
    const response = await fetch(`${API_URL}/logbook/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Gagal menghapus logbook");
    return response.json();
  },
};