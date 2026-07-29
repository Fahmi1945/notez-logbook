// src/hooks/useMentorRequests.ts
import { useState, useCallback, useEffect } from "react";
import { mentorshipApi } from "@/lib/api/mentorship";
import { useUIStore } from "@/store/ui-store";

export const useMentorRequests = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [requests, setRequests] = useState<Record<string, any>[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useUIStore();

    const fetchRequests = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await mentorshipApi.getHistory();
            console.log("RESPONSE BODY API:", response);
            const finalData = (response as { data?: unknown }).data ? (response as { data: unknown }).data : response; 
            setRequests(Array.isArray(finalData) ? finalData : []);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            showToast(err.response?.data?.message || "Gagal memuat daftar permintaan", "error");
        } finally {
            setIsLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        let isMounted = true;
        async function load() {
            setIsLoading(true);
            try {
                const response = await mentorshipApi.getHistory();
                const finalData = (response as { data?: unknown }).data ? (response as { data: unknown }).data : response;
                if (isMounted) {
                    setRequests(Array.isArray(finalData) ? finalData : []);
                }
            } catch (error: unknown) {
                const err = error as { response?: { data?: { message?: string } } };
                if (isMounted) {
                    showToast(err.response?.data?.message || "Gagal memuat daftar permintaan", "error");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }
        load();

        return () => {
            isMounted = false;
        };
    }, [showToast]);

    const handleApproval = async (requestId: number | string, action: "accept" | "reject", alasan: string) => {
        try {
            setIsLoading(true);
            if (action === "accept") {
                const res = await mentorshipApi.acceptRequest(requestId, alasan);
                showToast(res.message || "Mahasiswa diterima", "success");
            } else {
                const res = await mentorshipApi.rejectRequest(requestId, alasan);
                showToast(res.message || "Mahasiswa ditolak", "success");
            }
            
            setRequests((prev) => prev.filter((req) => req.requestId !== requestId));
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            showToast(err.response?.data?.message || `Gagal memproses permintaan`, "error");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        requests,
        isLoading,
        handleApproval,
        refreshRequests: fetchRequests
    };
};