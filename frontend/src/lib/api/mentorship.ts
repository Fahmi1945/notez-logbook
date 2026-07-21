import { apiClient } from "./client";
import { Mentor, MentorshipHistory } from "@/types/mentorship";
import Cookies from "js-cookie";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;


export const mentorshipApi = {
    // 1. Mengambil Katalog Mentor
    getMentors: async () => {
        const response = await apiClient.get<{ data: Mentor[] }>("/mentorship");
        return response.data.data;
    },

    getHistory: async () => {
    // 1. Ambil token yang disimpan saat login
    const token = Cookies.get("token"); 

    // 2. Eksekusi request dengan Bearer Token
    const response = await axios.get(`${BASE_URL}/mentorship/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    
    // Kembalikan data dari response backend
    return response.data; 
  },

    // 3. Mengirim Request Bimbingan
    requestMentorship: async (mentorId: number) => {
        const response = await apiClient.post(`/mentorship/request/${mentorId}`);
        return response.data;
    },
};