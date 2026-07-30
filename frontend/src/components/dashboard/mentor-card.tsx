"use client";

import React from "react";
import Link from "next/link";
import { ChalkboardTeacher } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import type { MentorshipHistory } from "@/types/mentorship";

interface MentorCardProps {
  activeMentor: MentorshipHistory | undefined;
}

export function MentorCard({ activeMentor }: MentorCardProps) {
  if (!activeMentor) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-fade-in-up">
        <h2 className="text-lg font-semibold font-heading text-brand-dark mb-4">
          Mentor Pembimbing
        </h2>
        <div className="text-center py-4">
          <ChalkboardTeacher
            className="w-12 h-12 mx-auto text-slate-300"
            weight="duotone"
          />
          <p className="mt-3 text-sm text-slate-500 font-body">
            Belum ada mentor aktif.
          </p>
          <Link href="/mentorship">
            <Button variant="outline" size="sm" className="mt-4">
              Cari Mentor
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-fade-in-up">
      <h2 className="text-lg font-semibold font-heading text-brand-dark mb-4">
        Mentor Pembimbing
      </h2>
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-brand-primary">
          <ChalkboardTeacher className="w-6 h-6" weight="fill" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-900 truncate font-body">
            {activeMentor.mentorName || "Mentor"}
          </p>
          <span className="mt-1 inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
            Aktif
          </span>
        </div>
      </div>
    </div>
  );
}
