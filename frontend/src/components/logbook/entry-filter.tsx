"use client";

import { MagnifyingGlass, Funnel, Printer, Plus, CalendarBlank, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EntryFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  dateFilter: string;
  setDateFilter: (date: string) => void;
}

export default function EntryFilter({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
}: EntryFilterProps) {
  const hasActiveFilter = searchQuery !== "" || statusFilter !== "all" || dateFilter !== "";

  const clearAll = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDateFilter("");
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 animate-fade-in-down">
      {/* Kiri: Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 w-full lg:w-auto">
        {/* Search Bar */}
        <div className="relative w-full sm:w-72 lg:w-64">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <MagnifyingGlass size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-9 py-2.5 border border-gray-200 rounded-xl bg-white text-sm font-body focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all placeholder:text-gray-300 text-gray-700 shadow-sm"
            placeholder="Cari judul kegiatan..."
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-300 hover:text-gray-500 transition-colors"
            >
              <X size={14} weight="bold" />
            </button>
          )}
        </div>

        {/* Dropdown Status */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Funnel size={16} className="text-gray-400" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`block w-full sm:w-auto pl-10 pr-8 py-2.5 border rounded-xl bg-white text-sm font-body focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 appearance-none cursor-pointer transition-all shadow-sm text-gray-700 ${
              statusFilter !== "all" ? "border-brand-primary/50 bg-brand-primary/3" : "border-gray-200"
            }`}
          >
            <option value="all">Semua Status</option>
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Filter Tanggal */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <CalendarBlank size={16} className="text-gray-400" />
          </div>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className={`block w-full sm:w-auto pl-10 pr-3 py-2.5 border rounded-xl bg-white text-sm font-body text-gray-600 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all cursor-text shadow-sm ${
              dateFilter ? "border-brand-primary/50 bg-brand-primary/3" : "border-gray-200"
            }`}
          />
        </div>

        {/* Tombol Reset */}
        {hasActiveFilter && (
          <button
            onClick={clearAll}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs text-gray-500 hover:text-rose-600 bg-white border border-gray-200 hover:border-rose-200 hover:bg-rose-50/50 rounded-xl transition-all font-medium shadow-sm"
          >
            <X size={13} weight="bold" />
            Reset
          </button>
        )}
      </div>

      {/* Kanan: Aksi */}
      <div className="flex flex-row items-center gap-2.5 w-full lg:w-auto justify-end font-body">
        <Button
          variant="outline"
          className="text-brand-primary border-brand-primary/30 hover:bg-brand-primary/8 hover:border-brand-primary/60 flex items-center gap-2 h-10 px-4 rounded-xl shadow-sm bg-white text-sm"
        >
          <Printer size={16} />
          <span className="hidden sm:inline">Cetak Laporan</span>
          <span className="sm:hidden">Cetak</span>
        </Button>

        <Link href="/logbook/new">
          <Button className="bg-brand-accent hover:bg-orange-500 text-white flex items-center gap-2 h-10 px-4 rounded-xl shadow-sm shadow-brand-accent/25 border-none text-sm transition-all">
            <Plus size={16} weight="bold" />
            <span className="hidden sm:inline">Tambah Entri</span>
            <span className="sm:hidden">Tambah</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}