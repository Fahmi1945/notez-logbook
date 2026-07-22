"use client";

import React, { useState } from "react";
import { 
  MagnifyingGlass, 
  ChalkboardTeacher, 
  EnvelopeSimple,
  Users
} from "@phosphor-icons/react";
import { RequestAction } from "./request-action";
import { Mentor } from "@/types/mentorship";

// 1. UPDATE PROPS: Ganti isSubmitting menjadi submittingId dan requestedIds
interface MentorListProps {
  mentors: Mentor[];
  onApply: (mentorId: number) => void;
  submittingId?: number | null;
  requestedIds?: number[]; 
}

export function MentorList({ mentors, onApply }: MentorListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMentors = mentors.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
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

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden divide-y divide-gray-100">
        {filteredMentors.map((mentor) => {
          return (
            <div key={mentor.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-gray-50 transition-colors">
              
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

              <div className="flex items-center gap-4 sm:gap-6 justify-between sm:justify-end mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-gray-100">
                {mentor.studentCount !== undefined && (
                  <div className="flex flex-col sm:items-end text-sm">
                    <span className="text-gray-500 text-xs mb-0.5">Membimbing</span>
                    <span className="font-semibold text-gray-700 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-brand-primary" weight="fill" />
                      {mentor.studentCount} Mahasiswa
                    </span>
                  </div>
                )}

                {/* 3. PANGGIL KOMPONEN: Lempar status yang sudah dihitung */}
                <RequestAction
                  onApply={async () => {
                    await onApply(mentor.id);
                  }}
                />
              </div>

            </div>
          );
        })}

        {filteredMentors.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Tidak ada mentor yang cocok dengan pencarian Anda.
          </div>
        )}
      </div>
    </div>
  );
}