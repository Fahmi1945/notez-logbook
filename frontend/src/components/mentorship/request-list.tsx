"use client";

import React from "react";
import { Clock, CheckCircle, XCircle } from "@phosphor-icons/react";

// Variabel data history dipindah ke sini
const REQUEST_HISTORY = [
  { id: 101, mentorName: "Siti Aminah, M.Kom.", date: "15 Okt 2026", status: "rejected" },
  { id: 102, mentorName: "Budi Santoso, S.Kom., M.T.", date: "16 Okt 2026", status: "pending" },
];

export function RequestList() {
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
            {REQUEST_HISTORY.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {req.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {req.mentorName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {req.status === "pending" && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                      <Clock className="w-3.5 h-3.5" /> Menunggu Review
                    </span>
                  )}
                  {req.status === "approved" && (
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
          </tbody>
        </table>
      </div>
    </div>
  );
}