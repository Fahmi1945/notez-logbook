"use client";

import { useState, useEffect, useRef } from "react";
import { FilePdf, X, CalendarBlank, DownloadSimple } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface ExportPDFModalProps {
  isOpen: boolean;
  isExporting: boolean;
  onClose: () => void;
  onConfirm: (startDate?: string, endDate?: string) => void;
}

export default function ExportPDFModal({
  isOpen,
  isExporting,
  onClose,
  onConfirm,
}: ExportPDFModalProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateError, setDateError] = useState<string | null>(null);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Reset form saat modal dibuka (state adjustment during render)
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setStartDate("");
      setEndDate("");
      setDateError(null);
    }
  }

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => cancelRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Tutup dengan Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isExporting) onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, isExporting, onClose]);

  const handleConfirm = () => {
    // Validasi: endDate tidak boleh lebih awal dari startDate
    if (startDate && endDate && endDate < startDate) {
      setDateError("Tanggal selesai tidak boleh lebih awal dari tanggal mulai.");
      return;
    }
    setDateError(null);
    onConfirm(startDate || undefined, endDate || undefined);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="export-pdf-title"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-scale-in"
        onClick={!isExporting ? onClose : undefined}
      />

      {/* Panel */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Accent bar biru */}
        <div className="h-1 bg-gradient-to-r from-brand-primary to-brand-dark" />

        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
              <FilePdf size={22} weight="fill" className="text-brand-primary" />
            </div>
            <div>
              <h2
                id="export-pdf-title"
                className="text-base font-heading font-bold text-gray-900"
              >
                Ekspor Laporan PDF
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Hanya logbook yang disetujui yang diekspor
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isExporting}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors ml-2 shrink-0 disabled:opacity-40"
            aria-label="Tutup"
          >
            <X size={16} weight="bold" />
          </button>
        </div>

        {/* Body — date range inputs */}
        <div className="px-6 pt-5 pb-2 space-y-4">
          <p className="text-xs text-gray-500 leading-relaxed">
            Pilih rentang tanggal untuk menyaring entri yang akan diekspor.
            Kosongkan untuk mengekspor semua logbook yang telah disetujui.
          </p>

          {/* Tanggal Mulai */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
              <CalendarBlank size={13} className="text-brand-primary" />
              Tanggal Mulai
              <span className="text-gray-400 font-normal">(opsional)</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setDateError(null);
              }}
              disabled={isExporting}
              max={endDate || undefined}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 font-body focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Tanggal Selesai */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
              <CalendarBlank size={13} className="text-brand-primary" />
              Tanggal Selesai
              <span className="text-gray-400 font-normal">(opsional)</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setDateError(null);
              }}
              disabled={isExporting}
              min={startDate || undefined}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 font-body focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Error validasi */}
          {dateError && (
            <p className="text-xs text-rose-500 font-medium">{dateError}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-5">
          <button
            ref={cancelRef}
            onClick={onClose}
            disabled={isExporting}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Batal
          </button>
          <Button
            onClick={handleConfirm}
            isLoading={isExporting}
            disabled={isExporting}
            className="flex-1 bg-brand-primary hover:bg-brand-dark text-white rounded-xl text-sm font-semibold shadow-sm shadow-brand-primary/30 gap-2"
          >
            {!isExporting && <DownloadSimple size={15} weight="bold" />}
            {isExporting ? "Mengunduh..." : "Unduh PDF"}
          </Button>
        </div>
      </div>
    </div>
  );
}
