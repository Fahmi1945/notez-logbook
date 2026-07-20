import { useState, useEffect, useCallback } from "react";
import { mentorshipApi } from "@/lib/api/mentorship";
import { Mentor, MentorshipHistory } from "@/types/mentorship";
import { useUIStore } from "@/store/ui-store";
import { useAuthStore } from "@/store/auth-store";
import { mentorshipRequestSchema } from "@/lib/validators/mentorship.schema"; 

export const useMentorship = (activeTab: "catalog" | "history") => {
  const [mentors, setMentors] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { showToast } = useUIStore();
  const { user } = useAuthStore(); 

  const fetchMentors = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await mentorshipApi.getMentors();
      setMentors(data || []);
    } catch (error: any) {
      showToast(error.response?.data?.message || "Gagal memuat katalog mentor", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const fetchHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await mentorshipApi.getHistory(); 

      setHistory(response.data || []); 
      
    } catch (error: any) {
      showToast(error.response?.data?.message || "Gagal memuat riwayat", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        if (activeTab === "catalog") {
          await fetchMentors();
          await fetchHistory(); 
        } 
        else if (activeTab === "history") {
          await fetchHistory();
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [activeTab, fetchHistory]);

  const applyForMentorship = async (mentorId: number) => {
    try {
      const validationResult = mentorshipRequestSchema.safeParse({ mentorId });

      if (!validationResult.success) {
        const errorMessage = validationResult.error.issues[0].message;
        showToast(errorMessage, "error");
        throw new Error(errorMessage);
      }

      const res = await mentorshipApi.requestMentorship(validationResult.data.mentorId);
      showToast(res.message || "Berhasil mengajukan bimbingan!", "success");
      
    } catch (error: any) {
      // Menangkap error dari Axios atau throw error dari Zod
      const message = error.response?.data?.message || error.message || "Gagal mengajukan bimbingan";
      showToast(message, "error");
      throw error; // Wajib diteruskan agar UI (page.tsx) tahu kalau prosesnya gagal
    }
  };

  return {
    mentors,
    history,
    isLoading,
    applyForMentorship,
    refreshHistory: fetchHistory
  };
};