import { useState, useEffect, useCallback } from "react";
import { mentorshipApi } from "@/lib/api/mentorship";
import { Mentor, MentorshipHistory } from "@/types/mentorship";
import { useUIStore } from "@/store/ui-store";
import { useAuthStore } from "@/store/auth-store";

export const useMentorship = (activeTab: "catalog" | "history") => {
  const [mentors, setMentors] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { showToast } = useUIStore();
  const { user } = useAuthStore(); // Ambil data user yang sedang login

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
      const res = await mentorshipApi.requestMentorship(mentorId);
      showToast(res.message || "Berhasil mengajukan bimbingan!", "success");
    } catch (error: any) {
      showToast(error.response?.data?.message || "Gagal mengajukan bimbingan", "error");
      throw error; 
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