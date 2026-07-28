"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { entriesApi } from "@/lib/api/entries";
import { LogbookEntry } from "@/types/entry";
import LogbookDetailSkeleton from "@/components/logbook/logbook-detail-skeleton";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CalendarBlank,
  WarningCircle,
  Paperclip,
  FilePdf,
  Image as ImageIcon,
  CheckCircle,
  ArrowSquareOut,
  Pencil,
} from "@phosphor-icons/react";

function AttachmentIcon({ fileName }: { fileName: string }) {
  const isPdf = fileName.toLowerCase().endsWith(".pdf");
  return isPdf
    ? <FilePdf size={20} weight="fill" className="text-red-500 shrink-0" />
    : <ImageIcon size={20} weight="fill" className="text-blue-500 shrink-0" />;
}

export default function LogbookDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [entry, setEntry] = useState<LogbookEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const res = await entriesApi.getById(id);
        setEntry(res.data);
      } catch (err: unknown) {
        const errorObj = err as { message?: string };
        setError(errorObj.message || "Gagal mengambil detail logbook.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  if (isLoading) {
    return <LogbookDetailSkeleton />;
  }

  if (error || !entry) {
    return (
      <div className="p-6 max-w-4xl mx-auto font-body mt-10">
        <div className="text-center p-10 bg-rose-50 text-rose-600 rounded-2xl border border-rose-200 animate-fade-in-down shadow-sm">
          <p className="font-heading font-bold text-lg mb-2">Terjadi Kesalahan</p>
          <p className="text-sm mb-6 text-rose-500">{error || "Data logbook tidak ditemukan."}</p>
          <Link
            href="/logbook"
            className="inline-flex px-6 py-2.5 bg-white border border-rose-200 rounded-xl text-sm hover:bg-rose-50 transition-colors font-medium text-rose-700 shadow-sm"
          >
            Kembali ke Daftar
          </Link>
        </div>
      </div>
    );
  }

  const canEdit = entry.status === "draft" || entry.status === "rejected";

  return (
    <div className="p-6 max-w-4xl mx-auto font-body animate-fade-in-down">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/logbook"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-brand-primary mb-5 transition-colors font-medium"
        >
          <ArrowLeft size={16} weight="bold" />
          Kembali ke Manajemen Logbook
        </Link>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="p-6 sm:p-8 border-b border-gray-100 bg-gradient-to-br from-brand-primary/5 to-transparent">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-heading font-bold text-brand-dark mb-4 leading-tight">
                {entry.title || "Tidak ada judul"}
              </h1>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-gray-500 font-medium text-sm shadow-sm">
                <CalendarBlank size={16} weight="regular" className="text-brand-primary" />
                {entry.activity_date
                  ? new Date(entry.activity_date).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "-"}
              </div>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-3 flex-shrink-0">
              <Badge status={entry.status} />
              {canEdit && (
                <Link
                  href={`/logbook/${entry.id}/edit`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/8 text-brand-primary border border-brand-primary/20 rounded-xl text-xs font-semibold hover:bg-brand-primary hover:text-white transition-all"
                >
                  <Pencil size={14} weight="bold" />
                  Edit Entri
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Deskripsi */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-widest flex items-center gap-2">
              <CheckCircle size={14} weight="fill" className="text-emerald-400" />
              Deskripsi Pekerjaan
            </h3>
            <div className="p-5 bg-gray-50/70 rounded-xl border border-gray-100 text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
              {entry.description || "Tidak ada deskripsi."}
            </div>
          </div>

          {/* Hambatan (jika ada) */}
          {entry.obstacles && (
            <div>
              <h3 className="text-xs font-semibold text-rose-400 mb-3 uppercase tracking-widest flex items-center gap-2">
                <WarningCircle size={14} weight="fill" />
                Hambatan & Kendala
              </h3>
              <div className="p-5 bg-rose-50 rounded-xl border border-rose-100 text-rose-700 leading-relaxed whitespace-pre-wrap text-sm">
                {entry.obstacles}
              </div>
            </div>
          )}

          {/* Lampiran (jika ada) */}
          {entry.attachments && entry.attachments.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-widest flex items-center gap-2">
                <Paperclip size={14} weight="bold" className="text-brand-accent" />
                Lampiran ({entry.attachments.length} file)
              </h3>
              <ul className="space-y-4">
                {entry.attachments.map((att) => {
                  const isImage = att.file_name.toLowerCase().match(/\.(jpg|jpeg|png)$/);
                  const attachmentUrl = `/api/proxy/attachments/${att.id}`;
                  
                  return (
                    <li key={att.id}>
                      {isImage ? (
                        <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm max-w-xl">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={attachmentUrl}
                            alt={att.file_name}
                            className="w-full h-auto max-h-96 object-contain bg-checkerboard"
                          />
                          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
                          <div className="absolute bottom-3 left-4 right-12 text-white">
                            <p className="text-sm font-semibold truncate drop-shadow">{att.file_name}</p>
                          </div>
                          <a
                            href={attachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center bg-black/50 text-white hover:bg-black/70 transition-colors shadow-md"
                            title="Buka gambar di tab baru"
                          >
                            <ArrowSquareOut size={14} weight="bold" />
                          </a>
                        </div>
                      ) : (
                        <a
                          href={attachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3.5 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-brand-primary/30 hover:bg-brand-primary/3 transition-all group max-w-xl"
                        >
                          <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-50 border border-gray-100 group-hover:border-brand-primary/20 shrink-0">
                            <AttachmentIcon fileName={att.file_name} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-brand-dark truncate group-hover:text-brand-primary transition-colors">
                              {att.file_name}
                            </p>
                            <p className="text-[11px] text-gray-400">Klik untuk membuka file PDF</p>
                          </div>
                          <ArrowSquareOut
                            size={16}
                            weight="regular"
                            className="text-gray-300 group-hover:text-brand-primary transition-colors shrink-0"
                          />
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}