"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogbookEntry, LogbookStatus } from "@/types/entry";
import {
  Pencil,
  Trash,
  CalendarBlank,
  Paperclip,
  DotsThreeVertical,
  PaperPlaneTilt,
} from "@phosphor-icons/react";
import { WarningIcon } from "@/components/ui/warning-icon";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { entriesApi } from "@/lib/api/entries";
import { useUIStore } from "@/store/ui-store";

// ─── Types ───────────────────────────────────────────────────────────────────

interface EntryListProps {
  entries: LogbookEntry[];
  onDelete: (id: number) => void;
  onRefresh?: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Cek apakah entri boleh di-edit / hapus / submit */
const isModifiable = (status: LogbookStatus) =>
  status === "draft" || status === "rejected";

/** Format tanggal ke format Indonesia */
const formatDate = (dateStr: string, style: "short" | "long" = "short") =>
  new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: style,
    year: "numeric",
  });

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Tombol "Submit ke Mentor" */
function SubmitButton({
  entryId,
  onSuccess,
}: {
  entryId: number;
  onSuccess?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const showToast = useUIStore((s) => s.showToast);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      await entriesApi.submit(entryId);
      showToast("Logbook berhasil disubmit ke mentor.", "success");
      onSuccess?.();
    } catch {
      showToast("Gagal submit logbook. Coba lagi.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="secondary"
      isLoading={loading}
      onClick={handleClick}
      className="bg-violet-50 text-violet-600 border border-violet-200 hover:bg-violet-100 hover:text-violet-700 gap-1.5 text-xs rounded-lg"
      title="Submit entri ke mentor"
    >
      <PaperPlaneTilt size={14} weight="bold" />
      Submit
    </Button>
  );
}

/** Dropdown titik 3 untuk Edit & Hapus */
function ActionMenu({
  entryId,
  onDelete,
}: {
  entryId: number;
  onDelete: (e: React.MouseEvent) => void;
}) {
  return (
    <Dropdown
      trigger={
        <button
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
          title="Opsi lainnya"
          aria-label="Opsi lainnya"
        >
          <DotsThreeVertical size={18} weight="bold" />
        </button>
      }
      align="right"
    >
      <Link
        href={`/logbook/${entryId}/edit`}
        onClick={(e) => e.stopPropagation()}
        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
      >
        <Pencil size={14} weight="bold" className="text-amber-500" />
        Edit
      </Link>
      <DropdownItem
        variant="danger"
        icon={<Trash size={14} weight="bold" className="text-rose-500" />}
        onClick={onDelete}
      >
        Hapus
      </DropdownItem>
    </Dropdown>
  );
}

// ─── Shared row parts (DRY for desktop & mobile) ─────────────────────────────

function AttachmentCount({ count }: { count: number }) {
  if (count === 0) return <span className="text-gray-300 text-xs">—</span>;
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-primary/8 text-brand-primary rounded-lg text-xs font-semibold border border-brand-primary/15">
      <Paperclip size={13} weight="bold" />
      {count}
    </span>
  );
}

function RevisionNote({ obstacles }: { obstacles: string }) {
  return (
    <p className="text-rose-500 text-[11px] mt-2 font-medium flex items-start gap-1.5">
      <WarningIcon size={13} className="text-rose-500 mt-0.5" />
      <span>Revisi: {obstacles}</span>
    </p>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function EntryList({ entries, onDelete, onRefresh }: EntryListProps) {
  const router = useRouter();

  // State hapus
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openConfirm = useCallback((id: number, e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleCancelDelete = useCallback(() => setDeleteTarget(null), []);

  const handleSubmitSuccess = useCallback(() => {
    onRefresh?.();
    router.refresh();
  }, [onRefresh, router]);

  const navigateToDetail = useCallback(
    (id: number) => router.push(`/logbook/${id}`),
    [router]
  );

  // ─── Empty state ───────────────────────────────────────────────────────
  if (entries.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center border-gray-200 shadow-sm animate-fade-in-down">
        <div className="w-16 h-16 rounded-full bg-brand-white-bg border border-gray-200 flex items-center justify-center mb-4">
          <CalendarBlank size={28} weight="regular" className="text-gray-300" />
        </div>
        <p className="text-brand-dark font-semibold text-sm mb-1">
          Belum ada entri logbook
        </p>
        <p className="text-gray-400 text-xs">
          Klik tombol &quot;Tambah Entri&quot; untuk mulai mencatat aktivitasmu.
        </p>
      </Card>
    );
  }

  // ─── Render ────────────────────────────────────────────────────────────
  return (
    <>
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

      <Card className="border-gray-200 overflow-hidden animate-fade-in-down">
        {/* ── DESKTOP TABLE ──────────────────────────────────────────────── */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Tanggal</TableHead>
                <TableHead className="w-full">Judul &amp; Deskripsi</TableHead>
                <TableHead className="text-center">Lampiran</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {entries.map((entry) => {
                const canModify = isModifiable(entry.status);

                return (
                  <TableRow
                    key={entry.id}
                    onClick={() => navigateToDetail(entry.id)}
                    className="cursor-pointer group"
                  >
                    {/* Tanggal */}
                    <TableCell>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-white border border-gray-100 rounded-lg text-gray-500 font-medium text-xs shadow-sm whitespace-nowrap">
                        <CalendarBlank size={14} weight="regular" className="text-brand-primary shrink-0" />
                        {formatDate(entry.activity_date)}
                      </div>
                    </TableCell>

                    {/* Judul & Deskripsi */}
                    <TableCell>
                      <h4 className="text-brand-dark font-heading font-bold text-sm mb-1 leading-snug group-hover:text-brand-primary transition-colors">
                        {entry.title}
                      </h4>
                      <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                        {entry.description}
                      </p>
                      {entry.status === "rejected" && entry.obstacles && (
                        <RevisionNote obstacles={entry.obstacles} />
                      )}
                    </TableCell>

                    {/* Lampiran */}
                    <TableCell className="text-center">
                      <AttachmentCount count={entry.attachments?.length ?? 0} />
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <div className="flex justify-center">
                        <Badge status={entry.status} />
                      </div>
                    </TableCell>

                    {/* Aksi */}
                    <TableCell>
                      <div
                        className="flex justify-center items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {canModify ? (
                          <>
                            <SubmitButton entryId={entry.id} onSuccess={handleSubmitSuccess} />
                            <ActionMenu entryId={entry.id} onDelete={(e) => openConfirm(entry.id, e)} />
                          </>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* ── MOBILE CARDS ───────────────────────────────────────────────── */}
        <div className="md:hidden divide-y divide-gray-50">
          {entries.map((entry) => {
            const canModify = isModifiable(entry.status);

            return (
              <div
                key={entry.id}
                onClick={() => navigateToDetail(entry.id)}
                className="p-4 hover:bg-brand-white-bg transition-colors cursor-pointer"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-brand-dark font-heading font-bold text-sm leading-snug line-clamp-1">
                      {entry.title}
                    </h4>
                    <div className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 bg-brand-white border border-gray-100 rounded-lg text-gray-400 text-[11px] font-medium">
                      <CalendarBlank size={12} className="text-brand-primary" />
                      {formatDate(entry.activity_date, "long")}
                    </div>
                  </div>
                  <Badge status={entry.status} />
                </div>

                {/* Description */}
                <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-3">
                  {entry.description}
                </p>

                {entry.status === "rejected" && entry.obstacles && (
                  <RevisionNote obstacles={entry.obstacles} />
                )}

                {/* Bottom row */}
                <div
                  className="flex items-center justify-between pt-2 border-t border-gray-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  {entry.attachments && entry.attachments.length > 0 ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-primary/8 text-brand-primary rounded-md text-[11px] font-semibold">
                      <Paperclip size={11} weight="bold" />
                      {entry.attachments.length} lampiran
                    </span>
                  ) : (
                    <span />
                  )}

                  {canModify && (
                    <div className="flex items-center gap-2">
                      <SubmitButton entryId={entry.id} onSuccess={handleSubmitSuccess} />
                      <ActionMenu entryId={entry.id} onDelete={(e) => openConfirm(entry.id, e)} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}