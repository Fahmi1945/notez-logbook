"use client";

import { useState, useRef } from "react";
import {
  UploadSimple,
  X,
  FilePdf,
  CheckCircle,
  ArrowsClockwise,
} from "@phosphor-icons/react";
import { WarningIcon } from "@/components/ui/warning-icon";

interface AttachmentUploadProps {
  /** File yang saat ini dipilih (maks 1). */
  files: File[];
  onChange: (files: File[]) => void;
  /**
   * URL preview lampiran yang sudah ada di server (mode Edit).
   * Format: `/api/logbook/attachments/:id`
   */
  existingAttachmentUrl?: string;
  existingFileName?: string;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
const ALLOWED_EXTENSIONS = ".jpg,.jpeg,.png,.pdf";
const MAX_SIZE_MB = 5;
const MAX_FILES = 1;

/** Kembalikan true bila file adalah gambar (bukan PDF) */
const isImageFile = (file: File) => file.type.startsWith("image/");
const isImageUrl = (url: string) =>
  /\.(jpg|jpeg|png)(\?.*)?$/i.test(url);

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AttachmentUpload({
  files,
  onChange,
  existingAttachmentUrl,
  existingFileName,
}: AttachmentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasFile = files.length > 0;

  const validateAndSet = (incoming: File[]) => {
    setError(null);

    // Ambil hanya file pertama (max 1)
    const file = incoming[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(`Format tidak didukung. Hanya JPG, PNG, JPEG, dan PDF yang diizinkan.`);
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Ukuran file melebihi batas maksimum ${MAX_SIZE_MB}MB.`);
      return;
    }

    // Buat object URL untuk preview gambar
    if (isImageFile(file)) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }

    onChange([file]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    validateAndSet(Array.from(e.dataTransfer.files));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) validateAndSet(Array.from(e.target.files));
    e.target.value = "";
  };

  const removeFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setError(null);
    onChange([]);
  };

  // ─── Mode: file baru sudah dipilih ───────────────────────────────────────
  if (hasFile) {
    const file = files[0];
    const isPdf = !isImageFile(file);
    const displayUrl = previewUrl;

    return (
      <div className="space-y-3 animate-fade-in-down">
        {/* Preview area */}
        <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm">
          {/* Image preview */}
          {!isPdf && displayUrl ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={displayUrl}
                alt={file.name}
                className="w-full max-h-64 object-contain bg-checkerboard"
              />
              {/* Overlay gradient bawah */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
              {/* Info di atas gambar */}
              <div className="absolute bottom-3 left-4 right-12 text-white">
                <p className="text-sm font-semibold truncate drop-shadow">{file.name}</p>
                <p className="text-[11px] opacity-80">{formatFileSize(file.size)}</p>
              </div>
            </div>
          ) : (
            /* PDF preview placeholder */
            <div className="flex items-center gap-3 p-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                <FilePdf size={26} weight="fill" className="text-rose-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-brand-dark truncate">{file.name}</p>
                <p className="text-[11px] text-gray-400">{formatFileSize(file.size)}</p>
              </div>
            </div>
          )}

          {/* Tombol hapus file (pojok kanan atas) */}
          <button
            type="button"
            onClick={removeFile}
            className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-md ${
              !isPdf && displayUrl
                ? "bg-black/50 text-white hover:bg-black/70"
                : "bg-brand-white text-gray-500 border border-gray-200 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200"
            }`}
            title="Ganti file"
            aria-label="Hapus file"
          >
            <X size={14} weight="bold" />
          </button>
        </div>

        {/* Sukses indicator + ganti file */}
        <div className="flex items-center justify-between px-1">
          <p className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <CheckCircle size={15} weight="fill" />
            File siap diunggah
          </p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-1.5 text-xs text-brand-primary hover:text-brand-dark font-medium transition-colors"
          >
            <ArrowsClockwise size={13} weight="bold" />
            Ganti file
          </button>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept={ALLOWED_EXTENSIONS}
            onChange={handleFileInput}
          />
        </div>
      </div>
    );
  }

  // ─── Mode: ada lampiran existing dari server (mode Edit) ──────────────────
  if (existingAttachmentUrl && !hasFile) {
    const isImg = existingFileName ? isImageUrl(existingFileName) : false;
    const fullUrl = existingAttachmentUrl;

    return (
      <div className="space-y-3 animate-fade-in-down">
        <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm">
          {isImg ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fullUrl}
                alt={existingFileName ?? "Lampiran"}
                className="w-full max-h-64 object-contain"
              />
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-3 left-4 right-12 text-white">
                <p className="text-sm font-semibold truncate drop-shadow">
                  {existingFileName ?? "Lampiran tersimpan"}
                </p>
                <p className="text-[11px] opacity-70">Lampiran saat ini</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                <FilePdf size={26} weight="fill" className="text-rose-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-brand-dark truncate">
                  {existingFileName ?? "Lampiran tersimpan"}
                </p>
                <p className="text-[11px] text-gray-400">PDF · Lampiran saat ini</p>
              </div>
            </div>
          )}
        </div>

        {/* Ganti file */}
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-gray-400">Lampiran sudah tersimpan di server.</p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-1.5 text-xs text-brand-primary hover:text-brand-dark font-medium transition-colors"
          >
            <ArrowsClockwise size={13} weight="bold" />
            Ganti lampiran
          </button>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept={ALLOWED_EXTENSIONS}
            onChange={handleFileInput}
          />
        </div>
      </div>
    );
  }

  // ─── Mode: belum ada file (Drop Zone) ────────────────────────────────────
  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          relative flex flex-col items-center justify-center gap-3
          border-2 border-dashed rounded-2xl px-6 py-10 cursor-pointer
          transition-all duration-200 group select-none
          ${isDragging
            ? "border-brand-primary bg-brand-primary/5 scale-[1.01]"
            : "border-gray-200 bg-gray-50/60 hover:border-brand-primary hover:bg-brand-primary/3"
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={ALLOWED_EXTENSIONS}
          onChange={handleFileInput}
        />

        {/* Icon circle */}
        <div className={`
          w-14 h-14 rounded-full flex items-center justify-center transition-all
          ${isDragging
            ? "bg-brand-primary/15 scale-110"
            : "bg-brand-white border border-gray-200 shadow-sm group-hover:bg-brand-primary/10 group-hover:border-brand-primary/30 group-hover:scale-105"
          }
        `}>
          <UploadSimple
            size={24}
            weight="bold"
            className={`transition-colors ${isDragging ? "text-brand-primary" : "text-gray-400 group-hover:text-brand-primary"}`}
          />
        </div>

        <div className="text-center">
          <p className={`text-sm font-semibold transition-colors ${isDragging ? "text-brand-primary" : "text-gray-600 group-hover:text-brand-dark"}`}>
            {isDragging ? "Lepaskan file di sini" : "Seret & lepas file di sini"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            atau <span className="text-brand-primary font-semibold underline decoration-dotted">klik untuk pilih file</span>
          </p>
          <p className="text-[11px] text-gray-400 mt-2.5 bg-brand-white/80 px-3 py-1 rounded-full border border-gray-100 inline-block">
            JPG · PNG · JPEG · PDF &nbsp;·&nbsp; Maks. {MAX_SIZE_MB}MB &nbsp;·&nbsp; {MAX_FILES} file
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-[12px] text-rose-600 font-medium flex items-center gap-1.5 px-1">
          <WarningIcon size={14} className="text-rose-500" />
          {error}
        </p>
      )}
    </div>
  );
}
