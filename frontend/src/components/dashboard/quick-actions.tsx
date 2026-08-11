"use client";

import React from "react";
import Link from "next/link";
import { Plus, BookBookmark, UsersThree, LockSimple } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/ui-store";
import { MESSAGES } from "@/config/messages";

interface QuickActionsProps {
  hasActiveMentor: boolean;
}

export function QuickActions({ hasActiveMentor }: QuickActionsProps) {
  const showToast = useUIStore((s) => s.showToast);

  const handleNoMentorClick = () => {
    showToast(MESSAGES.LOGBOOK.NO_ACTIVE_MENTOR, "error");
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-fade-in-up">
      <h2 className="text-lg font-semibold font-heading text-brand-dark mb-4">
        Aksi Cepat
      </h2>
      <div className="flex flex-col gap-3">
        {hasActiveMentor ? (
          <Link href="/logbook/new">
            <Button
              variant="primary"
              className="w-full flex justify-start gap-3"
            >
              <Plus className="w-5 h-5" weight="bold" />
              Tambah Entri Baru
            </Button>
          </Link>
        ) : (
          <Button
            variant="outline"
            onClick={handleNoMentorClick}
            title="Anda belum memiliki mentor pendamping yang aktif"
            className="w-full flex justify-start gap-3 bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed hover:bg-gray-100 hover:text-gray-400 hover:border-gray-200"
          >
            <LockSimple className="w-5 h-5" weight="bold" />
            Tambah Entri Baru
          </Button>
        )}
        <Link href="/logbook">
          <Button
            variant="outline"
            className="w-full flex justify-start gap-3"
          >
            <BookBookmark className="w-5 h-5" weight="regular" />
            Lihat Semua Logbook
          </Button>
        </Link>
        <Link href="/mentorship">
          <Button
            variant="outline"
            className="w-full flex justify-start gap-3"
          >
            <UsersThree className="w-5 h-5" weight="regular" />
            Halaman Mentorship
          </Button>
        </Link>
      </div>
    </div>
  );
}
