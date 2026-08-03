import { useState, useCallback, useEffect } from "react";
import { mentorReviewApi, ReviewStatus } from "@/lib/api/mentor-review";
import { useUIStore } from "@/store/ui-store";
import { LogbookEntry } from "@/types/entry";
import { reviewActionSchema } from "@/lib/validators/review.schema";
import { MESSAGES } from "@/config/messages";

/**
 * Hook untuk halaman antrean: /mentor/review
 * Menampilkan daftar entri logbook berstatus "submitted" dari seluruh menti.
 */
export function useReviewQueue() {
  const [entries, setEntries] = useState<LogbookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useUIStore();

  const fetchQueue = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await mentorReviewApi.getQueue();
      setEntries(res.data || []);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      const message = errorObj.response?.data?.message || MESSAGES.REVIEW.QUEUE_FETCH_FAILED;
      setError(message);
      showToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchQueue();
  }, [fetchQueue]);

  return { entries, isLoading, error, refetch: fetchQueue };
}

/**
 * Hook untuk halaman detail: /mentor/review/[id]
 * Ambil detail 1 entri + fungsi approve/reject.
 */
export function useReviewDetail(id: string | number | undefined) {
  const [entry, setEntry] = useState<LogbookEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useUIStore();

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      setError(null);
      const res = await mentorReviewApi.getById(id);
      setEntry(res.data);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setError(errorObj.response?.data?.message || MESSAGES.REVIEW.DETAIL_FETCH_FAILED);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDetail();
  }, [fetchDetail]);

  /**
   * Kirim aksi review (approved/rejected) lewat endpoint evaluate tunggal.
   * Melempar error kalau validasi gagal atau request API gagal,
   * supaya komponen form bisa menangani state-nya sendiri (mis. tidak menutup modal).
   */
  const submitReview = async (status: ReviewStatus, comment?: string) => {
    if (!id) return;

    let finalComment = comment?.trim();
    if (status === "approved" && !finalComment) {
      finalComment = MESSAGES.REVIEW.DEFAULT_APPROVE_NOTE;
    }
    
    const validation = reviewActionSchema.safeParse({ status, comment: finalComment });
    if (!validation.success) {
      const message = validation.error.issues[0].message;
      showToast(message, "error");
      throw new Error(message);
    }

    setIsProcessing(true);
    try {
      const res = await mentorReviewApi.evaluate(
        id,
        validation.data.status,
        validation.data.comment
      );

      setEntry(res.data);
      showToast(
        res.message ||
          (status === "approved" ? MESSAGES.REVIEW.APPROVE_SUCCESS : MESSAGES.REVIEW.REJECT_SUCCESS),
        "success"
      );
      return res.data;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { errors?: unknown; message?: string } } };
      const apiData = errorObj.response?.data;

      let message = status === "approved" ? MESSAGES.REVIEW.APPROVE_FAILED : MESSAGES.REVIEW.REJECT_FAILED;
      if (apiData) {
        if (apiData.errors) {
          message = typeof apiData.errors === "string" ? apiData.errors : JSON.stringify(apiData.errors);
        } else if (apiData.message) {
          message = apiData.message;
        } else {
          message = JSON.stringify(apiData);
        }
      }

      showToast(`Error: ${message}`, "error");
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  return { entry, isLoading, isProcessing, error, refetch: fetchDetail, submitReview };
}