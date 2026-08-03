import { useState, useCallback } from "react";
import { entriesApi } from "@/lib/api/entries";
import { LogbookEntry } from "@/types/entry";
import { MESSAGES } from "@/config/messages";
import { useUIStore } from "@/store/ui-store";

export function useEntries() {
  const [entries, setEntries] = useState<LogbookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const showToast = useUIStore((s) => s.showToast);

  const fetchEntries = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await entriesApi.getAll();
      setEntries(res.data || []);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const msg = e.response?.data?.message || MESSAGES.LOGBOOK.FETCH_FAILED;
      setError(msg);
      showToast(msg, "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const deleteEntry = async (id: number) => {
    try {
      setIsLoading(true);
      await entriesApi.delete(id);
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
      showToast(MESSAGES.LOGBOOK.DELETE_SUCCESS, "success");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const msg = e.response?.data?.message || MESSAGES.LOGBOOK.DELETE_FAILED;
      setError(msg);
      showToast(msg, "error");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    entries,
    isLoading,
    error,
    fetchEntries,
    deleteEntry,
  };
}