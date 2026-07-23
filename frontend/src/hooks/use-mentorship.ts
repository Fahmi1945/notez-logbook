import { useState, useEffect, useCallback } from "react";
import { mentorshipApi } from "@/lib/api/mentorship";
import { useUIStore } from "@/store/ui-store";
import { mentorshipRequestSchema } from "@/lib/validators/mentorship.schema"; 
import { ActiveStudent, Mentor, MentorshipHistory } from '@/types/mentorship';

export const useMentorship = (activeTab: "catalog" | "history") => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [history, setHistory] = useState<MentorshipHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { showToast } = useUIStore();

  const fetchMentors = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await mentorshipApi.getMentors();
      setMentors(data || []);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      showToast(err.response?.data?.message || "Gagal memuat katalog mentor", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const fetchHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await mentorshipApi.getHistory(); 

      setHistory(response.data || []); 
      
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      showToast(err.response?.data?.message || "Gagal memuat riwayat", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    let isMounted = true;
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        if (activeTab === "catalog") {
          const mentorsData = await mentorshipApi.getMentors();
          const historyRes = await mentorshipApi.getHistory();
          if (isMounted) {
            setMentors(mentorsData || []);
            setHistory(historyRes.data || []);
          }
        } 
        else if (activeTab === "history") {
          const historyRes = await mentorshipApi.getHistory();
          if (isMounted) {
            setHistory(historyRes.data || []);
          }
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [activeTab]);

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
      
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const message = err.response?.data?.message || err.message || "Gagal mengajukan bimbingan";
      showToast(message, "error");
      throw error;
    }
  };

  return {
    mentors,
    history,
    isLoading,
    applyForMentorship,
    refreshHistory: fetchHistory,
    fetchMentors,
  };
};

export function useActiveStudents() {
  const [students, setStudents] = useState<ActiveStudent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await mentorshipApi.getActiveStudents();
      setStudents(data);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      console.error("Gagal mengambil data mahasiswa aktif:", err);
      setError(errorObj.response?.data?.message || "Terjadi kesalahan saat memuat data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await mentorshipApi.getActiveStudents();
        if (isMounted) setStudents(data);
      } catch (err: unknown) {
        const errorObj = err as { response?: { data?: { message?: string } } };
        console.error("Gagal mengambil data mahasiswa aktif:", err);
        if (isMounted) setError(errorObj.response?.data?.message || "Terjadi kesalahan saat memuat data.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    load();

    return () => {
      isMounted = false;
    };
  }, []);

  return { students, isLoading, error, refetch: fetchStudents };
}