"use client";

import { useState, useCallback, useEffect } from "react";
import { entriesApi } from "@/lib/api/entries";
import { mentorshipApi } from "@/lib/api/mentorship";
import type { LogbookEntry, EntryStats } from "@/types/entry";
import type { MentorshipHistory } from "@/types/mentorship";

function calculateStats(entries: LogbookEntry[]): EntryStats {
  return {
    total: entries.length,
    draft: entries.filter((e) => e.status === "draft").length,
    submitted: entries.filter((e) => e.status === "submitted").length,
    approved: entries.filter((e) => e.status === "approved").length,
    rejected: entries.filter((e) => e.status === "rejected").length,
  };
}

export function useDashboard() {
  const [stats, setStats] = useState<EntryStats>({
    total: 0,
    draft: 0,
    submitted: 0,
    approved: 0,
    rejected: 0,
  });
  const [recentEntries, setRecentEntries] = useState<LogbookEntry[]>([]);
  const [mentorHistory, setMentorHistory] = useState<MentorshipHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [entriesRes, historyRes] = await Promise.all([
        entriesApi.getAll(),
        mentorshipApi.getHistory(),
      ]);

      const allEntries = entriesRes.data || [];
      setStats(calculateStats(allEntries));

      const sorted = [...allEntries].sort(
        (a, b) =>
          new Date(b.activity_date).getTime() -
          new Date(a.activity_date).getTime()
      );
      setRecentEntries(sorted.slice(0, 5));
      setMentorHistory(historyRes.data || []);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Gagal memuat data dashboard.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    async function loadDashboardData() {
      try {
        setIsLoading(true);
        setError(null);

        const [entriesRes, historyRes] = await Promise.all([
          entriesApi.getAll(),
          mentorshipApi.getHistory(),
        ]);

        if (isMounted) {
          const allEntries = entriesRes.data || [];
          setStats(calculateStats(allEntries));

          const sorted = [...allEntries].sort(
            (a, b) =>
              new Date(b.activity_date).getTime() -
              new Date(a.activity_date).getTime()
          );
          setRecentEntries(sorted.slice(0, 5));
          setMentorHistory(historyRes.data || []);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const e = err as { response?: { data?: { message?: string } } };
          setError(e.response?.data?.message || "Gagal memuat data dashboard.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const activeMentor = mentorHistory.find((h) => h.status === "accepted");

  return {
    stats,
    recentEntries,
    activeMentor,
    isLoading,
    error,
    refetch: fetchDashboardData,
  };
}
