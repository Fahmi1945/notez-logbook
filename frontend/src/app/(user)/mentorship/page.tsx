"use client";

import React, { useState } from "react";
import { MentorList } from "@/components/mentorship/mentor-list";
import { RequestList } from "@/components/mentorship/request-list";
import { useMentorship } from "@/hooks/use-mentorship";

export default function MentorshipPage() {
  const [activeTab, setActiveTab] = useState<"catalog" | "history">("catalog");
  const { mentors, history, isLoading, applyForMentorship } = useMentorship(activeTab);

  // State untuk menyimpan klik instan sebelum refresh (Optimistic Update)
  const [hiddenMentorIds, setHiddenMentorIds] = useState<number[]>([]);

  // JURUS DATABASE: Ekstrak semua ID mentor yang sudah ada di riwayat (history)
  // Pastikan property 'mentor_id' ini sesuai dengan response JSON dari backend-mu!
  const databaseAppliedIds = history.map((req: Record<string, unknown>) => (req as { mentorId?: number; mentor_id?: number }).mentorId || (req as { mentor_id?: number }).mentor_id); 

  // GABUNGKAN KEDUANYA: Mentor yang baru saja diklik + Mentor yang sudah ada di database
  const allUnavailableMentorIds = [...hiddenMentorIds, ...databaseAppliedIds];

  const handleApply = async (mentorId: number) => {
    // Sembunyikan instan dari layar saat diklik
    setHiddenMentorIds((prev) => [...prev, mentorId]);

    try {
      await applyForMentorship(mentorId); 
      // Sukses: Mentor biarkan hilang, nanti muncul di tab Riwayat
    } catch (error) {
      // Gagal: Munculkan lagi ke layar
      setHiddenMentorIds((prev) => prev.filter(id => id !== mentorId));
      console.error("Gagal mengajukan:", error);
    }
  };

  // 5. FILTER MENTOR: Hanya tampilkan mentor yang belum di-klik
  const visibleMentors = mentors.filter(mentor => !allUnavailableMentorIds.includes(mentor.id));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-brand-dark mb-2">
          Mentorship Bimbingan
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Pilih mentor pembimbing yang sesuai dengan fokus proyek logbook Anda.
        </p>
      </div>

      <div className="flex space-x-1 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("catalog")}
          className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "catalog"
              ? "border-brand-primary text-brand-primary"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Katalog Mentor
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "history"
              ? "border-brand-primary text-brand-primary"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Riwayat Pengajuan
        </button>
      </div>

      <div className="pt-2">
        {isLoading ? (
          <div className="py-12 text-center text-gray-500">Memuat data dari server...</div>
        ) : activeTab === "catalog" ? (
          <MentorList 
            // 6. LEMPAR DATA YANG SUDAH DI-FILTER
            mentors={visibleMentors} 
            onApply={handleApply} 
            // (Kamu bisa hapus prop submittingId dan requestedIds dari MentorList jika sudah tidak terpakai)
            submittingId={null} 
            requestedIds={[]} 
          />
        ) : (
          <RequestList history={history} />
        )}
      </div>
    </div>
  );
}