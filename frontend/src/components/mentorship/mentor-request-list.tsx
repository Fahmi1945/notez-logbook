"use client";

import { useState } from "react";
import { useMentorRequests } from "@/hooks/use-mentor-request";
import { Button } from "@/components/ui/Button"; 
import { Badge } from "@/components/ui/badge"; 
import { Spinner } from "@/components/ui/spinner"; 

export default function MentorRequestList() {
  const { requests, isLoading, handleApproval } = useMentorRequests();
  
  const [modal, setModal] = useState<{
    isOpen: boolean;
    action: "accept" | "reject" | null;
    requestId: string | number | null;
    studentName: string;
  }>({
    isOpen: false,
    action: null,
    requestId: null,
    studentName: "",
  });
  
  const [alasan, setAlasan] = useState("");

  const openModal = (id: string | number, action: "accept" | "reject", name: string) => {
    setModal({ isOpen: true, action, requestId: id, studentName: name });
    setAlasan(""); 
  };

  const closeModal = () => {
    setModal({ isOpen: false, action: null, requestId: null, studentName: "" });
  };

  const onSubmit = async () => {
    if (modal.requestId && modal.action) {
      await handleApproval(modal.requestId, modal.action, alasan);
      closeModal(); 
    }
  };

  if (isLoading && requests.length === 0) return <div className="flex justify-center p-8"><Spinner /></div>;
  
  if (requests.length === 0) {
    return (
      <div className="text-center p-8 text-brand-dark bg-white rounded-xl border border-gray-200 mt-4 animate-fade-in-down">
        Tidak ada permintaan bimbingan saat ini.
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-4 animate-fade-in-down">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-brand-white text-brand-dark font-heading font-semibold border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left whitespace-nowrap">TANGGAL</th>
              <th className="px-6 py-4 text-left">MAHASISWA</th>
              <th className="px-6 py-4 text-left whitespace-nowrap">STATUS</th>
              <th className="px-6 py-4 text-left whitespace-nowrap">AKSI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {requests.map((req) => (
              <tr key={req.requestId} className="hover:bg-brand-white/50 transition-colors">
                
                {/* Wajib whitespace-nowrap di <td> Tanggal biar 20 Jul dan 2026 nggak misah */}
                <td className="px-6 py-4 text-left align-middle font-body text-gray-500 whitespace-nowrap">
                  {req.createdAt 
                    ? new Date(req.createdAt).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })
                    : "-"}
                </td>

                {/* Kolom Mahasiswa dibiarkan natural tanpa w-full */}
                <td className="px-6 py-4 text-left align-middle">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 flex-shrink-0 rounded-full bg-blue-50 text-brand-primary flex items-center justify-center font-heading font-bold text-xs">
                      {req.studentName?.substring(0, 2).toUpperCase() || "NN"}
                    </div>
                    <span className="font-heading font-semibold text-brand-dark truncate">
                      {req.studentName}
                    </span>
                  </div>
                </td>

                {/* Tambahkan whitespace-nowrap di <td> Status */}
                <td className="px-6 py-4 text-left align-middle whitespace-nowrap">
                  <Badge status="pending" className="px-3 py-1 font-body">
                    ⏳ Perlu Persetujuan
                  </Badge>
                </td>
                
                {/* Tambahkan whitespace-nowrap di <td> Aksi */}
                <td className="px-6 py-4 text-left align-middle whitespace-nowrap">
                  <div className="flex justify-start gap-2 font-body">
                    <Button 
                      onClick={() => openModal(req.requestId, "accept", req.studentName)}
                      className="bg-status-approved hover:bg-green-600 text-white flex items-center gap-1 shadow-sm h-8 px-3 text-xs"
                    >
                      ✓ Terima
                    </Button>
                    <Button 
                      onClick={() => openModal(req.requestId, "reject", req.studentName)}
                      variant="outline"
                      className="text-status-rejected border-red-200 hover:bg-red-50 flex items-center gap-1 shadow-sm h-8 px-3 text-xs"
                    >
                      ✕ Tolak
                    </Button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- KOMPONEN POP-UP MODAL (Warna Dikembalikan ke Versi Clean) --- */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/40 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden animate-fade-in-down">
            <div className="p-6">
              <h3 className="text-lg font-heading font-bold text-brand-dark mb-2">
                {modal.action === "accept" ? "Terima Mahasiswa" : "Tolak Mahasiswa"}
              </h3>
              <p className="text-sm font-body text-gray-600 mb-5 leading-relaxed">
                Anda akan {modal.action === "accept" ? "menerima" : "menolak"} permintaan bimbingan dari <span className="font-heading font-bold text-brand-primary">{modal.studentName}</span>. 
                Silakan berikan pesan atau alasan (opsional).
              </p>
              
              <textarea
                value={alasan}
                onChange={(e) => setAlasan(e.target.value)}
                placeholder={modal.action === "accept" ? "Contoh: Selamat bergabung di tim!" : "Contoh: Kuota bimbingan sudah penuh."}
                className="w-full font-body border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary resize-none h-28 transition-all"
              />
            </div>
            
            <div className="px-6 py-4 bg-brand-white border-t border-gray-100 flex justify-end gap-3 font-body">
              <Button 
                variant="outline" 
                onClick={closeModal} 
                disabled={isLoading} 
                className="text-gray-600 border-gray-300 hover:text-brand-dark hover:bg-gray-100 transition-colors"
              >
                Batal
              </Button>
              <Button 
                onClick={onSubmit}
                disabled={isLoading}
                className={modal.action === "accept" ? "bg-status-approved hover:bg-green-600 text-white shadow-sm" : "bg-status-rejected hover:bg-red-600 text-white shadow-sm"}
              >
                {isLoading ? <Spinner /> : "Konfirmasi"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}