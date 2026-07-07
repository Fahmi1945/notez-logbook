"use client";

import React, { useState } from "react";
import { MentorList } from "@/components/mentorship/mentor-list";
import { RequestList } from "@/components/mentorship/request-list";

export default function MentorshipPage() {
  const [activeTab, setActiveTab] = useState<"catalog" | "history">("catalog");

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-brand-dark mb-2">
          Mentorship Bimbingan
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Pilih mentor pembimbing yang sesuai dengan fokus proyek logbook Anda.
        </p>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex space-x-1 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("catalog")}
          className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "catalog"
              ? "border-brand-primary text-brand-primary"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Katalog Mentor
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "history"
              ? "border-brand-primary text-brand-primary"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Riwayat Pengajuan
        </button>
      </div>

      {/* RENDER KOMPONEN BERDASARKAN TAB AKTIF */}
      <div className="pt-2">
        {activeTab === "catalog" ? <MentorList /> : <RequestList />}
      </div>
      
    </div>
  );
}