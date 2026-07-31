"use client";

import React from "react";
import Link from "next/link";
import { Plus, BookBookmark, UsersThree } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export function QuickActions() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-fade-in-up">
      <h2 className="text-lg font-semibold font-heading text-brand-dark mb-4">
        Aksi Cepat
      </h2>
      <div className="flex flex-col gap-3">
        <Link href="/logbook/new">
          <Button
            variant="primary"
            className="w-full flex justify-start gap-3"
          >
            <Plus className="w-5 h-5" weight="bold" />
            Tambah Entri Baru
          </Button>
        </Link>
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
