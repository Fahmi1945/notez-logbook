"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useEntries } from "@/hooks/use-entries";
import { useMentorStatus } from "@/hooks/use-mentor-status";
import { reportsApi } from "@/lib/api/reports";
import { useUIStore } from "@/store/ui-store";
import { MESSAGES } from "@/config/messages";
import EntryFilter from "@/components/logbook/entry-filter";
import ExportPDFModal from "@/components/logbook/export-pdf-modal";
import EntryList from "@/components/logbook/entry-list";
import LogbookListSkeleton from "@/components/logbook/logbook-list-skeleton";
import { Button } from "@/components/ui/button";
import { CaretLeft, CaretRight, WarningCircle } from "@phosphor-icons/react";
import Link from "next/link";

export default function LogbookPage() {
  const { entries, isLoading, error, fetchEntries, deleteEntry } = useEntries();
  const showToast = useUIStore((s) => s.showToast);
  const { hasActiveMentor, isLoading: isCheckingMentor } = useMentorStatus();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleNoMentorClick = () => {
    showToast(MESSAGES.LOGBOOK.NO_ACTIVE_MENTOR, "error");
  };

  const handleExportConfirm = useCallback(
    async (startDate?: string, endDate?: string) => {
      try {
        setIsExporting(true);
        await reportsApi.exportLogbookPDF({ startDate, endDate });
        showToast(MESSAGES.LOGBOOK.EXPORT_PDF_SUCCESS, "success");
        setIsExportModalOpen(false);
      } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string }; status?: number } };
        if (e.response?.status === 404) {
          showToast(MESSAGES.LOGBOOK.EXPORT_PDF_EMPTY, "error");
        } else {
          const msg = e.response?.data?.message || MESSAGES.LOGBOOK.EXPORT_PDF_FAILED;
          showToast(msg, "error");
        }
      } finally {
        setIsExporting(false);
      }
    },
    [showToast]
  );

  const filteredEntries = useMemo(() => {
    let result = entries;

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (entry) =>
          (entry.title || "").toLowerCase().includes(lowerQuery) ||
          (entry.description || "").toLowerCase().includes(lowerQuery)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((entry) => entry.status === statusFilter);
    }

    if (dateFilter) {
      result = result.filter((entry) => entry.activity_date.startsWith(dateFilter));
    }

    return result;
  }, [entries, searchQuery, statusFilter, dateFilter]);

  const handleSetSearchQuery = (query: string) => { setSearchQuery(query); setCurrentPage(1); };
  const handleSetStatusFilter = (status: string) => { setStatusFilter(status); setCurrentPage(1); };
  const handleSetDateFilter = (date: string) => { setDateFilter(date); setCurrentPage(1); };

  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / itemsPerPage));

  // Generate page numbers with ellipsis for large page counts
  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "...")[] = [];
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
    return pages;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto font-body">
      {/* Modal Export PDF */}
      <ExportPDFModal
        isOpen={isExportModalOpen}
        isExporting={isExporting}
        onClose={() => setIsExportModalOpen(false)}
        onConfirm={handleExportConfirm}
      />

      {/* Header */}
      <div className="mb-8 animate-fade-in-down">
        <h1 className="text-2xl font-heading font-bold text-brand-dark mb-1">
          Manajemen Logbook
        </h1>
        <p className="text-gray-400 text-sm">
          Catat dan pantau seluruh aktivitas bimbingan Anda di sini.
        </p>
      </div>

      {/* Banner: Belum ada mentor aktif */}
      {!isCheckingMentor && hasActiveMentor === false && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 animate-fade-in-down">
          <WarningCircle size={20} weight="fill" className="text-amber-500 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-800">
              {MESSAGES.LOGBOOK.NO_ACTIVE_MENTOR}
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              {MESSAGES.LOGBOOK.NO_ACTIVE_MENTOR_DESC}
            </p>
          </div>
          <Link
            href="/mentorship"
            className="shrink-0 text-xs font-semibold text-amber-700 underline underline-offset-2 hover:text-amber-900 transition-colors whitespace-nowrap"
          >
            Ajukan Sekarang →
          </Link>
        </div>
      )}

      {/* Filter */}
      <EntryFilter
        searchQuery={searchQuery}
        setSearchQuery={handleSetSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={handleSetStatusFilter}
        dateFilter={dateFilter}
        setDateFilter={handleSetDateFilter}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        hasActiveMentor={hasActiveMentor}
        isCheckingMentor={isCheckingMentor}
        onNoMentorClick={handleNoMentorClick}
      />

      {/* Konten */}
      {isLoading ? (
        <LogbookListSkeleton rows={itemsPerPage} />
      ) : error ? (
        <div className="text-center p-10 bg-rose-50 text-rose-600 rounded-2xl border border-rose-200 animate-fade-in-down">
          <p className="font-semibold mb-1">Terjadi Kesalahan</p>
          <p className="text-sm text-rose-400">{error}</p>
        </div>
      ) : (
        <>
          <EntryList 
            entries={paginatedEntries} 
            onDelete={deleteEntry} 
            onRefresh={fetchEntries} 
          />

          {/* Pagination */}
          {filteredEntries.length > itemsPerPage && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4 text-sm animate-fade-in-down">
              {/* Info */}
              <p className="text-gray-400 text-xs">
                Menampilkan{" "}
                <span className="font-semibold text-brand-dark">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                –{" "}
                <span className="font-semibold text-brand-dark">
                  {Math.min(currentPage * itemsPerPage, filteredEntries.length)}
                </span>{" "}
                dari{" "}
                <span className="font-semibold text-brand-dark">{filteredEntries.length}</span> entri
              </p>

              {/* Controls */}
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 border-gray-200 rounded-xl bg-white hover:bg-gray-50 hover:border-brand-primary/30 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm min-w-0"
                >
                  <CaretLeft size={15} />
                </Button>

                {getPageNumbers().map((page, i) =>
                  page === "..." ? (
                    <span key={`ellipsis-${i}`} className="w-8 text-center text-gray-400 text-xs">
                      ···
                    </span>
                  ) : (
                    <Button
                      key={page}
                      variant={currentPage === page ? "primary" : "outline"}
                      onClick={() => setCurrentPage(page as number)}
                      className={`w-9 h-9 p-0 flex items-center justify-center rounded-xl text-xs font-semibold shadow-sm min-w-0 ${
                        currentPage === page
                          ? "shadow-brand-primary/30"
                          : "border-gray-200 bg-white hover:bg-gray-50 hover:border-brand-primary/30 text-gray-600"
                      }`}
                    >
                      {page}
                    </Button>
                  )
                )}

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 border-gray-200 rounded-xl bg-white hover:bg-gray-50 hover:border-brand-primary/30 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm min-w-0"
                >
                  <CaretRight size={15} />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}