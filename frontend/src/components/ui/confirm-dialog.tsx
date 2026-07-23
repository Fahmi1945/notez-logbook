"use client";

import { useEffect, useRef } from "react";
import { Trash, X, Warning } from "@phosphor-icons/react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

/**
 * Reusable confirmation dialog dengan animasi dan focus trap.
 * Digunakan untuk aksi destruktif seperti hapus data.
 */
export function ConfirmDialog({
  isOpen,
  title = "Konfirmasi Hapus",
  description = "Apakah kamu yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.",
  confirmLabel = "Ya, Hapus",
  cancelLabel = "Batal",
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Auto-focus tombol batal saat dialog terbuka (safer default)
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => cancelRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Tutup dengan Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onCancel();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="confirm-dialog-title"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-scale-in"
        onClick={onCancel}
      />

      {/* Panel */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Top accent bar */}
        <div className="h-1 bg-gradient-to-r from-rose-400 to-rose-600" />

        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-0">
          <div className="flex items-center gap-3">
            {/* Icon lingkaran merah */}
            <div className="w-11 h-11 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
              <Warning size={22} weight="fill" className="text-rose-500" />
            </div>
            <div>
              <h2
                id="confirm-dialog-title"
                className="text-base font-heading font-bold text-gray-900"
              >
                {title}
              </h2>
            </div>
          </div>

          {/* Tombol close (X) */}
          <button
            onClick={onCancel}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors ml-2 shrink-0"
            aria-label="Tutup"
          >
            <X size={16} weight="bold" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pt-4 pb-6">
          <p className="text-sm text-gray-500 leading-relaxed pl-14">
            {description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6 pt-0">
          <button
            ref={cancelRef}
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm shadow-rose-500/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Trash size={15} weight="bold" />
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
