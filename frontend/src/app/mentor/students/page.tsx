"use client";

import { useState, useEffect } from "react";
import MentorRequestList from "@/components/mentorship/mentor-request-list";
import ActiveStudentList from "@/components/mentorship/active-student-list";
import { mentorshipApi } from "@/lib/api/mentorship";
import { ActiveStudent } from "@/types/mentorship";

export default function StudentPage() {
  const [activeTab, setActiveTab] = useState<"aktif" | "pending">("pending");
  const [acceptedStudents, setAcceptedStudents] = useState<ActiveStudent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab !== "aktif") return;

    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await mentorshipApi.getActiveStudents();
        if (isMounted) setAcceptedStudents(data);
      } catch (err) {
        console.error("Gagal ambil data mahasiswa aktif:", err);
        if (isMounted) setError("Gagal memuat data mahasiswa aktif.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header Info Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-brand-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 tracking-wider font-body">
              TOTAL MENTI AKTIF
            </p>
            <h2 className="text-2xl font-bold text-brand-dark font-heading">
              {acceptedStudents.length} Mahasiswa
            </h2>
          </div>
        </div>
        <div className="bg-brand-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 tracking-wider font-body">
              MENUNGGU REVIEW
            </p>
            <h2 className="text-2xl font-bold text-brand-accent font-heading">
              {acceptedStudents.reduce((sum, s) => sum + s.waitingReview, 0)} Logbook
            </h2>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 gap-4 font-body">
        <button
          onClick={() => setActiveTab("aktif")}
          className={`pb-3 font-semibold text-sm transition-colors ${
            activeTab === "aktif"
              ? "text-brand-primary border-b-2 border-brand-primary"
              : "text-gray-400 hover:text-gray-700"
          }`}
        >
          Mahasiswa Aktif
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`pb-3 font-semibold text-sm transition-colors ${
            activeTab === "pending"
              ? "text-brand-primary border-b-2 border-brand-primary"
              : "text-gray-400 hover:text-gray-700"
          }`}
        >
          Permintaan Persetujuan
        </button>
      </div>

      {activeTab === "pending" && <MentorRequestList />}

      {activeTab === "aktif" && (
        <>
          {isLoading && (
            <p className="text-center text-gray-500 py-8 font-body">Memuat data...</p>
          )}
          {error && (
            <p className="text-center text-rose-500 py-8 font-body">{error}</p>
          )}
          {!isLoading && !error && <ActiveStudentList data={acceptedStudents} />}
        </>
      )}
    </div>
  );
}