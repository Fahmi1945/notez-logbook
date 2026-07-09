"use client";

import React from "react";
import { Clock, CheckCircle, XCircle } from "@phosphor-icons/react";
import { MentorshipHistory } from "@/types/mentorship";

interface RequestListProps {
  // Saya tambahkan 'any' di sini untuk berjaga-jaga jika tipe MentorshipHistory 
  // di folder types kamu belum diubah ke format camelCase.
  history: any[]; 
}

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("id-ID", options);
}

export function RequestList({ history }: RequestListProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Mentor</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {history.map((req) => (
              // 1. PERBAIKAN KEY: Menggunakan req.requestId dari JSON backend
              <tr key={req.requestId} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {/* 2. PERBAIKAN TANGGAL: Menggunakan req.createdAt */}
                  {formatDate(req.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {/* 3. PERBAIKAN NAMA: Menggunakan req.mentorName */}
                  {req.mentorName || "Nama mentor tidak tersedia"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {req.status === "pending" && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                      <Clock className="w-3.5 h-3.5" /> Menunggu Review
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
              </tr>
            ))}
            
            {/* Tampilan jika data kosong */}
            {history.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
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