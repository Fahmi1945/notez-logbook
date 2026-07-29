import { useState, useCallback } from "react";
import { entriesApi } from "@/lib/api/entries";
import { LogbookEntry } from "@/types/entry";

export function useEntries() {
  const [entries, setEntries] = useState<LogbookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await entriesApi.getAll();
      setEntries(res.data || []);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj.message || "Terjadi kesalahan saat memuat data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteEntry = async (id: number) => {
    try {
      setIsLoading(true);
      await entriesApi.delete(id);
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj.message || "Gagal menghapus entri.");
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