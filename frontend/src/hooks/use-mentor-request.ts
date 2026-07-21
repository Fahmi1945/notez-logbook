// src/hooks/useMentorRequests.ts
import { useState, useCallback, useEffect } from "react";
import { mentorshipApi } from "@/lib/api/mentorship";
import { useUIStore } from "@/store/ui-store";

export const useMentorRequests = () => {
    const [requests, setRequests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useUIStore();

    const fetchRequests = useCallback(async () => {
        try {
            setIsLoading(true);
            // Data yang didapat dari getHistory saat mentor login otomatis adalah data antrean menti
            const response = await mentorshipApi.getHistory();
            console.log("RESPONSE BODY API:", response);
            const finalData = response.data ? response.data : response; 
            setRequests(Array.isArray(finalData) ? finalData : []);
        } catch (error: any) {
            showToast(error.response?.data?.message || "Gagal memuat daftar permintaan", "error");
        } finally {
            setIsLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    // Fungsi khusus mentor
 // Tambahkan parameter 'alasan'
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
        
        } catch (error: any) {
        showToast(error.response?.data?.message || `Gagal memproses permintaan`, "error");
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