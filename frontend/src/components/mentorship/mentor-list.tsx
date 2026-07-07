"use client";

import React, { useState } from "react";
import { MagnifyingGlass, ChalkboardTeacher, EnvelopeSimple } from "@phosphor-icons/react";
import { RequestAction } from "./request-action";

// Variabel data diperbarui: Hapus expertise & kuota, tambahkan email
const MENTORS = [
  { id: 1, name: "Budi Santoso, S.Kom., M.T.", email: "budi.santoso@notez.ac.id" },
  { id: 2, name: "Siti Aminah, M.Kom.", email: "siti.aminah@notez.ac.id" },
  { id: 3, name: "Ahmad Fauzi, Ph.D.", email: "ahmad.fauzi@notez.ac.id" },
];

export function MentorList() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter pencarian sekarang mencocokkan nama atau email
  const filteredMentors = MENTORS.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlass className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-shadow"
          placeholder="Cari nama atau email mentor..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tampilan UI: LIST */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden divide-y divide-gray-100">
        {filteredMentors.map((mentor) => (
          <div key={mentor.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-gray-50 transition-colors">
            
            {/* Info Mentor */}
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 bg-blue-50 text-brand-primary rounded-full flex items-center justify-center shrink-0">
                <ChalkboardTeacher className="w-6 h-6" weight="duotone" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">{mentor.name}</h3>
                <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-0.5">
                  <EnvelopeSimple className="w-4 h-4 shrink-0 text-gray-400" />
                  <span>{mentor.email}</span>
                </div>
              </div>
            </div>

            {/* Tombol Aksi (Bergeser ke kanan karena flex-1 di atas) */}
            <div className="flex justify-end sm:w-auto">
              <RequestAction onApply={() => alert(`Mengajukan ke ${mentor.name}`)} />
            </div>

          </div>
        ))}

        {filteredMentors.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Tidak ada mentor yang cocok dengan pencarian Anda.
          </div>
        )}
      </div>
    </div>
  );
}