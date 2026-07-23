"use client";

import { useState, useEffect, useMemo } from "react";
import { useEntries } from "@/hooks/use-entries";
import EntryFilter from "@/components/logbook/entry-filter";
import EntryList from "@/components/logbook/entry-list";
import { Spinner } from "@/components/ui/spinner";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

export default function LogbookPage() {
  const { entries, isLoading, error, fetchEntries, deleteEntry } = useEntries();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

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
      {/* Header */}
      <div className="mb-8 animate-fade-in-down">
        <h1 className="text-2xl font-heading font-bold text-brand-dark mb-1">
          Manajemen Logbook
        </h1>
        <p className="text-gray-400 text-sm">
          Catat dan pantau seluruh aktivitas bimbingan Anda di sini.
        </p>
      </div>

      {/* Filter */}
      <EntryFilter
        searchQuery={searchQuery}
        setSearchQuery={handleSetSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={handleSetStatusFilter}
        dateFilter={dateFilter}
        setDateFilter={handleSetDateFilter}
      />

      {/* Konten */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white rounded-2xl border border-gray-200 shadow-sm animate-fade-in-down">
          <Spinner />
          <p className="text-sm text-gray-400 mt-4">Memuat data logbook...</p>
        </div>
      ) : error ? (
        <div className="text-center p-10 bg-rose-50 text-rose-600 rounded-2xl border border-rose-200 animate-fade-in-down">
          <p className="font-semibold mb-1">Terjadi Kesalahan</p>
          <p className="text-sm text-rose-400">{error}</p>
        </div>
      ) : (
        <>
          <EntryList entries={paginatedEntries} onDelete={deleteEntry} />

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
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 hover:border-brand-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <CaretLeft size={15} />
                </button>

                {getPageNumbers().map((page, i) =>
                  page === "..." ? (
                    <span key={`ellipsis-${i}`} className="w-8 text-center text-gray-400 text-xs">
                      ···
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page as number)}
                      className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-semibold transition-all ${
                        currentPage === page
                          ? "bg-brand-primary text-white shadow-sm shadow-brand-primary/30"
                          : "border border-gray-200 bg-white hover:bg-gray-50 hover:border-brand-primary/30 text-gray-600"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 hover:border-brand-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <CaretRight size={15} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}