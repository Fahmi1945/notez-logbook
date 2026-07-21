"use client";

import { useState } from "react";
import MentorRequestList from "@/components/mentorship/mentor-request-list";
// import ActiveStudentList from "@/components/mentorship/ActiveStudentList"; // Untuk tab sebelahnya

export default function StudentPage() {
  // State untuk mengatur tab yang sedang aktif
  const [activeTab, setActiveTab] = useState<"aktif" | "pending">("pending");

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header Info Cards (Sesuai Mockup) */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
           {/* Icon Total Menti */}
           <div>
             <p className="text-xs font-semibold text-gray-500 tracking-wider">TOTAL MENTI AKTIF</p>
             <h2 className="text-2xl font-bold text-gray-800">2 Mahasiswa</h2>
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
           {/* Icon Menunggu Review */}
           <div>
             <p className="text-xs font-semibold text-gray-500 tracking-wider">MENUNGGU REVIEW</p>
             <h2 className="text-2xl font-bold text-gray-800">2 Logbook</h2>
           </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 gap-4">
        <button
          onClick={() => setActiveTab("aktif")}
          className={`pb-3 font-semibold text-sm transition-colors ${
            activeTab === "aktif" 
              ? "text-blue-600 border-b-2 border-blue-600" 
              : "text-gray-400 hover:text-gray-700"
          }`}
        >
          Mahasiswa Aktif
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`pb-3 font-semibold text-sm transition-colors ${
            activeTab === "pending" 
              ? "text-blue-600 border-b-2 border-blue-600" 
              : "text-gray-400 hover:text-gray-700"
          }`}
        >
          Permintaan Persetujuan
        </button>
      </div>

      {/* Render Komponen Berdasarkan Tab */}
      {activeTab === "pending" && <MentorRequestList />}
      {/* {activeTab === "aktif" && <ActiveStudentList />} */}

    </div>
  );
}