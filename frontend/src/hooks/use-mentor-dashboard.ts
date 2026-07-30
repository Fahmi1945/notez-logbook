import { useState, useCallback, useEffect } from "react";
import { mentorReviewApi } from "@/lib/api/mentor-review";
import { mentorshipApi } from "@/lib/api/mentorship";
import { useUIStore } from "@/store/ui-store";
import { LogbookEntry } from "@/types/entry";
import { ActiveStudent } from "@/types/mentorship";

interface DashboardStats {
  totalMentee: number;
  pendingReview: number;
  completedReview: number;
}

const RECENT_LIMIT = 5;

export function useMentorDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMentee: 0,
    pendingReview: 0,
    completedReview: 0,
  });
  const [recentPendingEntries, setRecentPendingEntries] = useState<LogbookEntry[]>([]);
  const [activeStudents, setActiveStudents] = useState<ActiveStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [studentsError, setStudentsError] = useState<string | null>(null);
  const { showToast } = useUIStore();

  const fetchDashboard = useCallback(async () => {
    const [reviewResult, studentsResult] = await Promise.allSettled([
      mentorReviewApi.getQueue(),
      mentorshipApi.getActiveStudents(),
    ]);

    // --- Process review queue ---
    let pendingCount = 0;
    let completedCount = 0;
    if (reviewResult.status === "fulfilled") {
      const allEntries: LogbookEntry[] = reviewResult.value.data || [];
      const pending = allEntries.filter((e) => e.status === "submitted");
      const completed = allEntries.filter(
        (e) => e.status === "approved" || e.status === "rejected"
      );
      pendingCount = pending.length;
      completedCount = completed.length;
      setRecentPendingEntries(pending.slice(0, RECENT_LIMIT));
      setReviewError(null);
    } else {
      setReviewError("Gagal memuat data antrean review.");
      showToast("Gagal memuat data antrean review.", "error");
    }

    // --- Process active students ---
    let menteeCount = 0;
    if (studentsResult.status === "fulfilled") {
      const students = studentsResult.value;
      menteeCount = students.length;
      setActiveStudents(students);
      setStudentsError(null);
    } else {
      setStudentsError("Gagal memuat data mahasiswa aktif.");
      showToast("Gagal memuat data mahasiswa aktif.", "error");
    }

    setStats({
      totalMentee: menteeCount,
      pendingReview: pendingCount,
      completedReview: completedCount,
    });

    setIsLoading(false);
  }, [showToast]);

  const refetch = useCallback(() => {
    setIsLoading(true);
    setReviewError(null);
    setStudentsError(null);
    fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    const loadDashboard = async () => {
      await fetchDashboard();
    };
    loadDashboard();
  }, [fetchDashboard]);

  return {
    stats,
    recentPendingEntries,
    activeStudents,
    isLoading,
    reviewError,
    studentsError,
    refetch,
  };
}
