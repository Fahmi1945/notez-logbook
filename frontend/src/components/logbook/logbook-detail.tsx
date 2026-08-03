import { LogbookEntry } from "@/types/entry";
import { Badge } from "@/components/ui/badge";
import {
  CalendarBlank,
  WarningCircle,
  Paperclip,
  FilePdf,
  Image as ImageIcon,
  CheckCircle,
  ArrowSquareOut,
  Pencil,
  ChatText,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

function AttachmentIcon({ fileName }: { fileName: string }) {
  const isPdf = fileName.toLowerCase().endsWith(".pdf");
  return isPdf ? (
    <FilePdf size={20} weight="fill" className="text-red-500 shrink-0" />
  ) : (
    <ImageIcon size={20} weight="fill" className="text-blue-500 shrink-0" />
  );
}

interface LogbookDetailProps {
  entry: LogbookEntry;
  onEdit?: () => void;
}

export function LogbookDetail({ entry, onEdit }: LogbookDetailProps) {
  const canEdit = entry.status === "draft";
  const latestFeedback = entry.feedbacks?.[0]?.comment;

  return (
    <div className="space-y-8 font-body animate-fade-in-down">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 p-5 bg-gradient-to-br from-brand-primary/5 to-transparent border border-gray-100 rounded-2xl">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-heading font-bold text-brand-dark mb-3 leading-tight">
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
          {canEdit && onEdit && (
            <Button
              onClick={onEdit}
              variant="outline"
              size="sm"
              className="border-brand-primary/20 text-brand-primary hover:bg-brand-primary hover:text-white gap-2 rounded-xl h-9"
            >
              <Pencil size={14} weight="bold" />
              Edit Entri
            </Button>
          )}
        </div>
      </div>

      {/* Catatan Review Mentor */}
      {entry.status === "rejected" && (
        <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">
          <WarningCircle size={18} weight="fill" className="mt-0.5 shrink-0 text-rose-500" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold mb-1">Logbook Ditolak</p>
            {latestFeedback ? (
              <>
                <p className="text-rose-600 text-xs mb-2">Alasan penolakan dari mentor:</p>
                <p className="text-rose-700 text-sm leading-relaxed whitespace-pre-wrap bg-rose-100/60 rounded-lg p-3 border border-rose-200/70">
                  {latestFeedback}
                </p>
              </>
            ) : (
              <p className="text-rose-600 text-xs leading-relaxed">
                Logbook ini telah ditolak oleh mentor dan tidak dapat diedit atau dikirim ulang.
              </p>
            )}
          </div>
        </div>
      )}

      {entry.status === "approved" && latestFeedback && (
        <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
          <ChatText size={18} weight="fill" className="mt-0.5 shrink-0 text-emerald-500" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold mb-1">Catatan Mentor</p>
            <p className="text-emerald-700 text-sm leading-relaxed whitespace-pre-wrap bg-emerald-100/60 rounded-lg p-3 border border-emerald-200/70">
              {latestFeedback}
            </p>
          </div>
        </div>
      )}

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
            Hambatan &amp; Kendala
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
  );
}
