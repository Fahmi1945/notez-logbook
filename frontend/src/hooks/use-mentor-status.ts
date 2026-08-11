import { useState, useEffect, useCallback } from "react";
import { mentorshipApi } from "@/lib/api/mentorship";
import type { MentorshipHistory } from "@/types/mentorship";

interface UseMentorStatusResult {
  hasActiveMentor: boolean | null; // null = masih loading
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useMentorStatus(): UseMentorStatusResult {
  const [hasActiveMentor, setHasActiveMentor] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const check = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await mentorshipApi.getHistory();
      const historyList: MentorshipHistory[] = res.data || [];
      const active = historyList.some((h) => h.status === "accepted");
      setHasActiveMentor(active);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Gagal memeriksa status mentor.");
      setHasActiveMentor(false); // fail-safe: anggap tidak ada mentor jika error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    check();
  }, [check]);

  return { hasActiveMentor, isLoading, error, refetch: check };
}
