// src/lib/api/mentorship.ts
import { apiClient } from "./client";
import { Mentor, MentorshipHistory, ActiveStudent } from "@/types/mentorship";
import { API_ENDPOINTS } from "@/lib/constant";

export const mentorshipApi = {
  // 1. Mengambil Katalog Mentor
  getMentors: async (): Promise<Mentor[]> => {
    const response = await apiClient.get(API_ENDPOINTS.MENTORSHIP.BASE);
    return response.data.data;
  },

  // 2. Mengambil History (Polimorfik)
  getHistory: async () => {
    // Token udah otomatis disisipin sama apiClient
    const response = await apiClient.get(API_ENDPOINTS.MENTORSHIP.HISTORY);
    return response.data;
  },

  // 3. Mengirim Request Bimbingan (User)
  requestMentorship: async (mentorId: number | string) => {
    const response = await apiClient.post(API_ENDPOINTS.MENTORSHIP.REQUEST(mentorId));
    return response.data;
  },

  // 4. Menerima Request (Mentor)
  acceptRequest: async (requestId: number | string, alasan: string) => {
    const response = await apiClient.post(API_ENDPOINTS.MENTORSHIP.ACCEPT(requestId), {
      information: alasan,
    });
    return response.data;
  },

  // 5. Menolak Request (Mentor)
  rejectRequest: async (requestId: number | string, alasan: string) => {
    const response = await apiClient.post(API_ENDPOINTS.MENTORSHIP.REJECT(requestId), {
      information: alasan,
    });
    return response.data;
  },

  // 6. Mengambil Daftar Mahasiswa Aktif
  getActiveStudents: async (): Promise<ActiveStudent[]> => {
    const response = await apiClient.get(API_ENDPOINTS.MENTORSHIP.GET_ACTIVE_STUDENTS);
    return response.data.data || response.data;
  },
};