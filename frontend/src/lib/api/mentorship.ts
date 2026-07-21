// src/lib/api/mentorship.ts
import { apiClient } from "./client";
import { Mentor, MentorshipHistory } from "@/types/mentorship";
import Cookies from "js-cookie";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const mentorshipApi = {
    // 1. Mengambil Katalog Mentor
    getMentors: async () => {
        const response = await apiClient.get("/mentorship");
        return response.data.data;
    },

    // 2. Mengambil History (Polimorfik)
    getHistory: async () => {
        // Token udah otomatis disisipin sama apiClient
        const response = await apiClient.get("/mentorship/history");
        return response.data; 
    },

    // 3. Mengirim Request Bimbingan (User)
    requestMentorship: async (mentorId: number) => {
        const response = await apiClient.post(`/mentorship/request/${mentorId}`);
        return response.data;
    },

    // 4. Menerima Request (Mentor)
    acceptRequest: async (requestId: number | string, alasan: string) => {
    // Tambahkan payload/body di parameter kedua
    const response = await apiClient.post(`/mentorship/${requestId}/accepted`, { 
        information: alasan // Ganti 'message' sesuai key yang diminta backend lu
    });
    return response.data;
},

    rejectRequest: async (requestId: number | string, alasan: string) => {
        const response = await apiClient.post(`/mentorship/${requestId}/rejected`, {
          information: alasan
        });
        return response.data;
    }
};