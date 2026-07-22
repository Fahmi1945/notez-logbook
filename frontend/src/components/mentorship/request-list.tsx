"use client";

// TAMBAHKAN useState DI SINI
import React, { useState } from "react";
import { Clock, CheckCircle, XCircle, ChatTeardropText } from "@phosphor-icons/react";
import { MentorshipHistory } from "@/types/mentorship";

interface RequestListProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  history: (MentorshipHistory & Record<string, any>)[]; 
}

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("id-ID", options);
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
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Mentor</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Pesan</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {history.map((req) => {
              const targetDate = req.status === "pending" ? req.createdAt : req.updatedAt;
              const isExpanded = expandedId === req.requestId;

              return (
                // Wajib pakai React.Fragment karena 1 loop me-return 2 elemen <tr>
                <React.Fragment key={req.requestId}>
                  {/* BARIS UTAMA (BISA DIKLIK) */}
                  <tr 
                    onClick={() => toggleRow(req.requestId)}
                    // Tambahkan cursor-pointer supaya kursor berubah jadi tangan
                    className="hover:bg-gray-50 transition-colors cursor-pointer group" 
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(targetDate)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {req.mentorName || "Nama mentor tidak tersedia"}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {req.status === "pending" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                          <Clock className="w-3.5 h-3.5" /> Menunggu
                        </span>
                      )}
                      {req.status === "accepted" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                          <CheckCircle className="w-3.5 h-3.5" /> Diterima
                        </span>
                      )}
                      {req.status === "rejected" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                          <XCircle className="w-3.5 h-3.5" /> Ditolak
                        </span>
                      )}
                    </td>

                    {/* KOLOM PETUNJUK KLIK */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-400 group-hover:text-brand-primary transition-colors">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-xs">Klik detail</span>
                        <ChatTeardropText className="w-4 h-4" />
                      </div>
                    </td>
                  </tr>

                  {/* BARIS TERSEMBUNYI (MUNCUL KALAU DIKLIK) */}
                  {isExpanded && (
                    <tr className="bg-brand-50/30 border-l-4 border-brand-primary">
                      {/* colSpan={4} artinya kolom ini membentang sepanjang 4 kolom di atasnya */}
                      <td colSpan={4} className="px-6 py-4">
                        <div className="flex flex-col space-y-1">
                          <span className="text-xs font-semibold text-gray-500 uppercase">
                            Catatan dari Mentor:
                          </span>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {req.information ? req.information : <span className="italic text-gray-400">Belum ada pesan / catatan.</span>}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
            
            {history.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  Belum ada riwayat pengajuan bimbingan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}