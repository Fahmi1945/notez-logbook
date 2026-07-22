"use client";

import { useState, useEffect, useMemo } from "react";
import { useEntries } from "@/hooks/use-entries";
import EntryFilter from "@/components/logbook/entry-filter";
import EntryList from "@/components/logbook/entry-list";
import { Spinner } from "@/components/ui/spinner";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

export default function LogbookPage() {
  const { entries, isLoading, error, fetchEntries, deleteEntry } = useEntries();
  
  // State untuk filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  
  // State untuk Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Sesuai screenshot, nampilin 5 item per halaman

  // Fetch data saat halaman pertama kali dimuat
  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  // Logika Filter Data (Berjalan otomatis jika ada state filter yang berubah)
  const filteredEntries = useMemo(() => {
    let result = entries;

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (entry) =>
          // Tambahkan fallback (|| "") untuk mencegah error jika title/description bernilai null dari DB
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

  const handleSetSearchQuery = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSetStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleSetDateFilter = (date: string) => {
    setDateFilter(date);
    setCurrentPage(1);
  };

  // Logika memotong data untuk Pagination
  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);

  return (
    <div className="p-6 max-w-7xl mx-auto font-body">
      {/* Header Halaman */}
      <div className="mb-8 animate-fade-in-down">
        <h1 className="text-2xl font-heading font-bold text-brand-dark mb-2">
          Manajemen Logbook
        </h1>
        <p className="text-gray-500 text-sm">
          Catat dan pantau seluruh aktivitas bimbingan Anda di sini.
        </p>
      </div>

      {/* Komponen Filter */}
      <EntryFilter 
        searchQuery={searchQuery}
        setSearchQuery={handleSetSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={handleSetStatusFilter}
        dateFilter={dateFilter}
        setDateFilter={handleSetDateFilter}
      />

      {/* Area Konten Utama */}
      {isLoading ? (
        <div className="flex justify-center p-12">
          <Spinner />
        </div>
      ) : error ? (
        <div className="text-center p-8 bg-red-50 text-red-600 rounded-xl border border-red-200">
          {error}
        </div>
      ) : (
        <>
          {/* Komponen List (Tabel) */}
          <EntryList entries={paginatedEntries} onDelete={deleteEntry} />
          
          {/* Pagination UI dari Screenshot Figma */}
          {filteredEntries.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-sm text-gray-500 animate-fade-in-down">
              <div className="mb-4 sm:mb-0">
                Menampilkan <span className="font-semibold text-brand-dark">{(currentPage - 1) * itemsPerPage + 1}</span> sampai <span className="font-semibold text-brand-dark">{Math.min(currentPage * itemsPerPage, filteredEntries.length)}</span> dari <span className="font-semibold text-brand-dark">{filteredEntries.length}</span> entri
              </div>
              
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-200 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  <CaretLeft size={16} />
                </button>
                
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md font-medium transition-colors ${
                      currentPage === i + 1 
                        ? "bg-brand-dark text-white border-brand-dark" 
                        : "border border-gray-200 bg-white hover:bg-gray-50 text-gray-600"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button 
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-200 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  <CaretRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}