"use client";

import { useState } from "react";
import { useMentorRequests } from "@/hooks/use-mentor-request";
import { Button } from "@/components/ui/button"; 
import { Badge } from "@/components/ui/badge"; 
import { Spinner } from "@/components/ui/spinner"; 
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import Modal from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Check, X } from "@phosphor-icons/react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

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
      <div className="text-center p-8 text-brand-dark bg-white rounded-xl border border-gray-200 mt-4 animate-fade-in-down font-mono">
        Tidak ada permintaan bimbingan saat ini.
      </div>
    );
  }

  return (
    <>
      <div className="mt-4 animate-fade-in-down">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>TANGGAL</TableHead>
              <TableHead>MAHASISWA</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>AKSI</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((req) => (
              <TableRow key={req.requestId}>
                
                {/* Tanggal */}
                <TableCell className="text-gray-500">
                  {req.createdAt 
                    ? format(new Date(req.createdAt), "dd MMM yyyy", { locale: idLocale })
                    : "-"}
                </TableCell>

                {/* Mahasiswa (Nama & Email) */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 flex-shrink-0 rounded-full bg-blue-50 text-brand-primary flex items-center justify-center font-bold text-xs">
                      {req.studentName?.substring(0, 2).toUpperCase() || "NN"}
                    </div>
                    <div>
                      <div className="font-semibold text-brand-dark truncate">
                        {req.studentName}
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge status="submitted" className="px-3 py-1 inline-flex items-center gap-1.5">
                    <Clock size={14} className="shrink-0 text-amber-600" />
                    <span>Perlu Persetujuan</span>
                  </Badge>
                </TableCell>
                
                {/* Aksi */}
                <TableCell>
                  <div className="flex justify-start gap-2">
                    <Button 
                      onClick={() => openModal(req.requestId, "accept", req.studentName)}
                      variant="success"
                      className="flex items-center gap-1.5 shadow-sm h-8 px-3 text-xs font-mono"
                    >
                      <Check size={14} />
                      Terima
                    </Button>
                    <Button 
                      onClick={() => openModal(req.requestId, "reject", req.studentName)}
                      variant="outline"
                      className="text-status-rejected border-red-200 hover:bg-red-50 flex items-center gap-1.5 shadow-sm h-8 px-3 text-xs font-mono"
                    >
                      <X size={14} />
                      Tolak
                    </Button>
                  </div>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* --- KOMPONEN POP-UP MODAL --- */}
      <Modal 
        isOpen={modal.isOpen} 
        onClose={closeModal} 
        title={modal.action === "accept" ? "Terima Mahasiswa" : "Tolak Mahasiswa"}
      >
        <div className="space-y-5">
          <p className="text-sm font-body text-gray-600 leading-relaxed">
            Anda akan {modal.action === "accept" ? "menerima" : "menolak"} permintaan bimbingan dari <span className="font-heading font-bold text-brand-primary">{modal.studentName}</span>. 
            Silakan berikan pesan atau alasan (opsional).
          </p>
          
          <Textarea
            value={alasan}
            onChange={(e) => setAlasan(e.target.value)}
            placeholder={modal.action === "accept" ? "Contoh: Selamat bergabung di tim!" : "Contoh: Kuota bimbingan sudah penuh."}
          />
          
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 font-body">
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
              variant={modal.action === "accept" ? "success" : "danger"}
              className="shadow-sm"
              isLoading={isLoading}
            >
              Konfirmasi
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
