"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LogbookEntry } from "@/types/entry";
import { Pencil, Trash, CalendarBlank, Paperclip } from "@phosphor-icons/react";
import { WarningIcon } from "@/components/ui/warning-icon";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import Link from "next/link";

interface EntryListProps {
  entries: LogbookEntry[];
  onDelete: (id: number) => void;
}

const STATUS_CONFIG = {
  approved: {
    label: "Approved",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
  },
  submitted: {
    label: "Submitted",
    className: "bg-violet-50 text-violet-700 border border-violet-200",
    dot: "bg-violet-500",
  },
  rejected: {
    label: "Rejected",
    className: "bg-rose-50 text-rose-700 border border-rose-200",
    dot: "bg-rose-500",
  },
  draft: {
    label: "Draft",
    className: "bg-slate-50 text-slate-600 border border-slate-200",
    dot: "bg-slate-400",
  },
};

function StatusBadge({ status }: { status: string }) {
  const cfg =
    STATUS_CONFIG[status.toLowerCase() as keyof typeof STATUS_CONFIG] ??
    STATUS_CONFIG.draft;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold w-max ${cfg.className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export default function EntryList({ entries, onDelete }: EntryListProps) {
  const router = useRouter();

  // State konfirmasi hapus
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openConfirm = useCallback((id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // jangan trigger row click
    setDeleteTarget(id);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (deleteTarget === null) return;
    setIsDeleting(true);
    try {
      await onDelete(deleteTarget);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  }, [deleteTarget, onDelete]);

  const handleCancelDelete = useCallback(() => {
    setDeleteTarget(null);
  }, []);

  // ─── Empty state ────────────────────────────────────────────────────────
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-gray-200 rounded-2xl font-body animate-fade-in-down shadow-sm">
        <div className="w-16 h-16 rounded-full bg-brand-white-bg border border-gray-200 flex items-center justify-center mb-4">
          <CalendarBlank size={28} weight="regular" className="text-gray-300" />
        </div>
        <p className="text-brand-dark font-semibold text-sm mb-1">
          Belum ada entri logbook
        </p>
        <p className="text-gray-400 text-xs">
          Klik tombol &quot;Tambah Entri&quot; untuk mulai mencatat aktivitasmu.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* ─── Confirm Dialog ────────────────────────────────────────────── */}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Hapus Entri Logbook?"
        description="Entri ini akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan dan semua lampiran terkait juga akan ikut terhapus."
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={isDeleting}
      />

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden animate-fade-in-down">
        {/* ── DESKTOP TABLE ──────────────────────────────────────────────── */}
        <div className="hidden md:block">
          <table className="w-full text-sm text-left">
            <thead className="bg-gradient-to-r from-brand-primary/5 to-transparent text-brand-dark font-heading font-bold uppercase text-[11px] border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap tracking-widest">
                  Tanggal
                </th>
                <th className="px-6 py-4 w-full tracking-widest">
                  Judul &amp; Deskripsi
                </th>
                <th className="px-6 py-4 whitespace-nowrap text-center tracking-widest">
                  Lampiran
                </th>
                <th className="px-6 py-4 whitespace-nowrap text-center tracking-widest">
                  Status
                </th>
                <th className="px-6 py-4 whitespace-nowrap text-center tracking-widest">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50 font-body">
              {entries.map((entry) => {
                const canModify =
                  entry.status === "draft" || entry.status === "rejected";

                return (
                  <tr
                    key={entry.id}
                    onClick={() => router.push(`/logbook/${entry.id}`)}
                    className="hover:bg-brand-white-bg transition-colors group cursor-pointer"
                  >
                    {/* Tanggal */}
                    <td className="px-6 py-4 align-middle whitespace-nowrap">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-100 rounded-lg text-gray-500 font-medium text-xs shadow-sm">
                        <CalendarBlank
                          size={14}
                          weight="regular"
                          className="text-brand-primary shrink-0"
                        />
                        {new Date(entry.activity_date).toLocaleDateString(
                          "id-ID",
                          { day: "numeric", month: "short", year: "numeric" }
                        )}
                      </div>
                    </td>

                    {/* Judul & Deskripsi */}
                    <td className="px-6 py-4 align-middle">
                      <h4 className="text-brand-dark font-heading font-bold text-sm mb-1 leading-snug group-hover:text-brand-primary transition-colors">
                        {entry.title}
                      </h4>
                      <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                        {entry.description}
                      </p>
                      {entry.status === "rejected" && entry.obstacles && (
                        <p className="text-rose-500 text-[11px] mt-2 font-medium flex items-start gap-1.5">
                          <WarningIcon
                            size={13}
                            className="text-rose-500 mt-0.5"
                          />
                          <span>Revisi: {entry.obstacles}</span>
                        </p>
                      )}
                    </td>

                    {/* Lampiran */}
                    <td className="px-6 py-4 align-middle text-center">
                      {entry.attachments && entry.attachments.length > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-primary/8 text-brand-primary rounded-lg text-xs font-semibold border border-brand-primary/15">
                          <Paperclip size={13} weight="bold" />
                          {entry.attachments.length}
                        </span>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 align-middle text-center">
                      <div className="flex justify-center">
                        <StatusBadge status={entry.status} />
                      </div>
                    </td>

                    {/* Aksi */}
                    <td className="px-6 py-4 align-middle">
                      <div
                        className="flex justify-center items-center gap-2"
                        onClick={(e) => e.stopPropagation()} // jangan trigger row click
                      >
                        {canModify ? (
                          <>
                            {/* Tombol Edit */}
                            <Link
                              href={`/logbook/${entry.id}/edit`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100 hover:border-amber-300 text-xs font-semibold transition-all"
                              title="Edit entri"
                            >
                              <Pencil size={14} weight="bold" />
                              Edit
                            </Link>

                            {/* Tombol Hapus */}
                            <button
                              onClick={(e) => openConfirm(entry.id, e)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 hover:border-rose-300 text-xs font-semibold transition-all"
                              title="Hapus entri"
                            >
                              <Trash size={14} weight="bold" />
                              Hapus
                            </button>
                          </>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── MOBILE CARDS ───────────────────────────────────────────────── */}
        <div className="md:hidden divide-y divide-gray-50">
          {entries.map((entry) => {
            const canModify =
              entry.status === "draft" || entry.status === "rejected";

            return (
              <div
                key={entry.id}
                onClick={() => router.push(`/logbook/${entry.id}`)}
                className="p-4 hover:bg-brand-white-bg transition-colors cursor-pointer"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-brand-dark font-heading font-bold text-sm leading-snug line-clamp-1">
                      {entry.title}
                    </h4>
                    <div className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 bg-white border border-gray-100 rounded-lg text-gray-400 text-[11px] font-medium">
                      <CalendarBlank
                        size={12}
                        className="text-brand-primary"
                      />
                      {new Date(entry.activity_date).toLocaleDateString(
                        "id-ID",
                        { day: "numeric", month: "long", year: "numeric" }
                      )}
                    </div>
                  </div>
                  <StatusBadge status={entry.status} />
                </div>

                {/* Description */}
                <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-3">
                  {entry.description}
                </p>

                {entry.status === "rejected" && entry.obstacles && (
                  <p className="text-rose-500 text-[11px] mb-3 font-medium flex items-start gap-1.5">
                    <WarningIcon size={13} className="text-rose-500 mt-0.5" />
                    <span>Revisi: {entry.obstacles}</span>
                  </p>
                )}

                {/* Bottom row */}
                <div
                  className="flex items-center justify-between pt-2 border-t border-gray-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Lampiran badge */}
                  {entry.attachments && entry.attachments.length > 0 ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-primary/8 text-brand-primary rounded-md text-[11px] font-semibold">
                      <Paperclip size={11} weight="bold" />
                      {entry.attachments.length} lampiran
                    </span>
                  ) : (
                    <span />
                  )}

                  {/* Action buttons */}
                  {canModify && (
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/logbook/${entry.id}/edit`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100 text-xs font-semibold transition-all"
                      >
                        <Pencil size={13} weight="bold" />
                        Edit
                      </Link>
                      <button
                        onClick={(e) => openConfirm(entry.id, e)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 text-xs font-semibold transition-all"
                      >
                        <Trash size={13} weight="bold" />
                        Hapus
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}