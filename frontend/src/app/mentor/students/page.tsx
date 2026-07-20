"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Users, 
  ClockClockwise, 
  CheckCircle,
  CaretRight,
  MagnifyingGlass,
  Check,
  X,
  HourglassHigh
} from "@phosphor-icons/react";

// --- DUMMY DATA YANG DIPERBARUI ---
// Mengandung kombinasi status 'accepted' dan 'pending'
const TEAM_DATA = [
  { id: 1, name: "Fahmi Zidan", status: "accepted", totalEntries: 14, pendingReview: 2 },
  { id: 2, name: "Ani Wijaya", status: "accepted", totalEntries: 8, pendingReview: 0 },
  { id: 3, name: "Budi Gunawan", status: "pending", totalEntries: 0, pendingReview: 0 },
  { id: 4, name: "Siti Nurhaliza", status: "pending", totalEntries: 0, pendingReview: 0 },
];

const getInitials = (name: string) => {
  const words = name.trim().split(" ");
  if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
  return words[0].substring(0, 2).toUpperCase();
};

export default function MentorStudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // --- STATE UNTUK POP-UP MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"accepted" | "rejected" | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<{id: number, name: string} | null>(null);
  const [actionMessage, setActionMessage] = useState("");

  const activeStudents = TEAM_DATA.filter(s => s.status === "accepted");
  const totalMenti = activeStudents.length;
  const totalPendingReviews = activeStudents.reduce((acc, curr) => acc + curr.pendingReview, 0);

  const filteredStudents = TEAM_DATA.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fungsi membuka pop-up
  const handleOpenModal = (id: number, name: string, action: "accepted" | "rejected") => {
    setSelectedStudent({ id, name });
    setModalAction(action);
    setActionMessage("");
    setIsModalOpen(true);
  };

  // Fungsi mengeksekusi tombol Submit di dalam pop-up
  const handleSubmitAction = () => {
    // TODO: Hubungkan dengan API (POST /api/mentorship/respond/{id})
    alert(`Mengeksekusi ${modalAction} untuk ${selectedStudent?.name} dengan catatan: ${actionMessage}`);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      
      {/* HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-brand-dark mb-2">
          Manajemen Bimbingan
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Tinjau permintaan bimbingan baru dan pantau progres tim mahasiswa Anda.
        </p>
      </div>

      {/* STATISTIK RINGKAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 text-brand-primary rounded-full flex items-center justify-center">
            <Users className="w-6 h-6" weight="duotone" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">TOTAL MENTI AKTIF</p>
            <p className="text-2xl font-bold text-gray-900">{totalMenti} Mahasiswa</p>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center">
            <ClockClockwise className="w-6 h-6" weight="duotone" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">MENUNGGU REVIEW</p>
            <p className="text-2xl font-bold text-gray-900">{totalPendingReviews} Logbook</p>
          </div>
        </div>
      </div>

      {/* AREA TABEL */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 sm:flex sm:items-center sm:justify-between">
          <div className="relative max-w-sm w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlass className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"
              placeholder="Cari nama mahasiswa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Mahasiswa</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Entri</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Menunggu Review</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  
                  {/* Kolom Profil */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-brand-primary flex items-center justify-center font-bold text-sm shrink-0">
                        {getInitials(student.name)}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {student.name}
                      </span>
                    </div>
                  </td>

                  {/* Kolom Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.status === "accepted" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        <CheckCircle className="w-3.5 h-3.5" /> Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                        <HourglassHigh className="w-3.5 h-3.5" /> Perlu Persetujuan
                      </span>
                    )}
                  </td>

                  {/* Kolom Total Entri (Hanya tampil jika sudah aktif) */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {student.status === "accepted" ? (
                      <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                        {student.totalEntries}
                      </span>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>

                  {/* Kolom Menunggu Review */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {student.status === "accepted" ? (
                      student.pendingReview > 0 ? (
                        <span className="inline-flex items-center justify-center min-w-8 text-sm font-bold text-white bg-red-500 px-2.5 py-1 rounded-full shadow-sm">
                          {student.pendingReview}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400 font-medium">-</span>
                      )
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>

                  {/* Kolom Aksi Dinamis */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {student.status === "pending" ? (
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(student.id, student.name, "accepted")}
                          className="inline-flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                        >
                          <Check className="w-4 h-4" weight="bold" /> Terima
                        </button>
                        <button 
                          onClick={() => handleOpenModal(student.id, student.name, "rejected")}
                          className="inline-flex items-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" weight="bold" /> Tolak
                        </button>
                      </div>
                    ) : (
                      <Link 
                        href={`/mentor/review?userId=${student.id}`} 
                        className="inline-flex items-center gap-1 text-brand-primary hover:text-brand-dark transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg"
                      >
                        Lihat Detail <CaretRight className="w-4 h-4" />
                      </Link>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL / POP-UP COMPONENT --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className={`p-6 border-b ${modalAction === 'accepted' ? 'border-green-100 bg-green-50/50' : 'border-red-100 bg-red-50/50'}`}>
              <h3 className="text-lg font-bold text-gray-900">
                {modalAction === 'accepted' ? 'Terima Permintaan' : 'Tolak Permintaan'}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Mahasiswa: <span className="font-semibold text-gray-800">{selectedStudent?.name}</span>
              </p>
            </div>
            
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catatan / Alasan {modalAction === 'rejected' && <span className="text-red-500">*wajib</span>}
              </label>
              <textarea
                rows={3}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-1 focus:ring-brand-primary focus:border-brand-primary outline-none transition-shadow resize-none"
                placeholder={modalAction === 'accepted' ? "Tambahkan pesan sambutan (opsional)..." : "Berikan alasan penolakan..."}
                value={actionMessage}
                onChange={(e) => setActionMessage(e.target.value)}
              />
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleSubmitAction}
                disabled={modalAction === 'rejected' && actionMessage.trim().length === 0}
                className={`px-5 py-2 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                  modalAction === 'accepted' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}