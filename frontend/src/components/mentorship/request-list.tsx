"use client";

// TAMBAHKAN useState DI SINI
import React, { useState } from "react";
import { Clock, CheckCircle, XCircle, ChatTeardropText } from "@phosphor-icons/react";
import { MentorshipHistory } from "@/types/mentorship";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface RequestListProps {
  history: MentorshipHistory[]; 
}

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return format(new Date(dateString), "dd MMM yyyy", { locale: idLocale });
}

export function RequestList({ history }: RequestListProps) {
  // STATE BARU: Untuk melacak ID baris yang sedang diklik/dibuka
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Fungsi untuk buka/tutup baris
  const toggleRow = (id: number) => {
    // Kalau baris yang sama diklik lagi, tutup. Kalau beda, buka yang baru.
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="mt-4 animate-fade-in-down">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead>Nama Mentor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Pesan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((req) => {
              const targetDate = req.createdAt;
              const isExpanded = expandedId === req.id;

              return (
                // Wajib pakai React.Fragment karena 1 loop me-return 2 elemen <tr>
                <React.Fragment key={req.id}>
                  {/* BARIS UTAMA (BISA DIKLIK) */}
                  <TableRow 
                    onClick={() => toggleRow(req.id)}
                    // Tambahkan cursor-pointer supaya kursor berubah jadi tangan
                    className="cursor-pointer group" 
                  >
                    <TableCell className="text-gray-600">
                      {formatDate(targetDate)}
                    </TableCell>
                    
                    <TableCell className="font-medium text-gray-900">
                      {req.mentorName || "Nama mentor tidak tersedia"}
                    </TableCell>
                    
                    <TableCell>
                      {req.status === "pending" && (
                        <Badge status="submitted" className="px-2.5 py-1 gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> Menunggu
                        </Badge>
                      )}
                      {req.status === "accepted" && (
                        <Badge status="approved" className="px-2.5 py-1 gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5" /> Diterima
                        </Badge>
                      )}
                      {req.status === "rejected" && (
                        <Badge status="rejected" className="px-2.5 py-1 gap-1.5">
                          <XCircle className="w-3.5 h-3.5" /> Ditolak
                        </Badge>
                      )}
                    </TableCell>

                    {/* KOLOM PETUNJUK KLIK */}
                    <TableCell className="text-right text-gray-400 group-hover:text-brand-primary transition-colors">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-xs">Klik detail</span>
                        <ChatTeardropText className="w-4 h-4" />
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* BARIS TERSEMBUNYI (MUNCUL KALAU DIKLIK) */}
                  {isExpanded && (
                    <TableRow className="bg-brand-50/30 border-l-4 border-brand-primary">
                      {/* colSpan={4} artinya kolom ini membentang sepanjang 4 kolom di atasnya */}
                      <TableCell colSpan={4}>
                        <div className="flex flex-col space-y-1">
                          <span className="text-xs font-semibold text-gray-500 uppercase">
                            Catatan dari Mentor:
                          </span>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {req.information ? req.information : <span className="italic text-gray-400">Belum ada pesan / catatan.</span>}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
            
            {history.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500">
                  Belum ada riwayat pengajuan bimbingan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
  );
}