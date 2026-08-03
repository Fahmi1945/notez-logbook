"use client";

import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { ArrowRight, CalendarBlank } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { LogbookEntry } from "@/types/entry";

interface RecentEntriesProps {
  entries: LogbookEntry[];
}

export function RecentEntries({ entries }: RecentEntriesProps) {
  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-slate-500 font-body">Belum ada entri logbook.</p>
        <Link href="/logbook/create">
          <Button variant="primary" className="mt-4">
            Buat Entry Pertama
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden animate-fade-in-up">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <h2 className="text-lg font-semibold font-heading text-brand-dark">
          Aktivitas Terbaru
        </h2>
        <Link
          href="/logbook"
          className="flex items-center gap-1 text-sm font-medium text-brand-primary hover:text-brand-dark transition-colors"
        >
          Lihat Semua <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="divide-y divide-slate-100">
        {entries.map((entry) => (
          <Link
            key={entry.id}
            href={`/logbook/${entry.id}`}
            className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-brand-primary/5 transition-colors"
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium text-slate-900 truncate font-body">
                {entry.title}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                <CalendarBlank className="w-3.5 h-3.5" weight="bold" />
                {format(new Date(entry.activity_date), "EEEE, dd MMM yyyy", {
                  locale: idLocale,
                })}
              </p>
            </div>
            <Badge status={entry.status} />
          </Link>
        ))}
      </div>
    </div>
  );
}
