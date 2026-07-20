"use client";

import { MagnifyingGlass, Funnel, Printer, Plus, CalendarBlank } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button"; // Sesuaikan path jika berbeda
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
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 animate-fade-in-down">
      
      {/* Bagian Kiri: Search, Status, & Date Filter */}
      <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 w-full lg:w-auto">
        {/* Search Bar */}
        <div className="relative w-full sm:w-72 lg:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlass size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-sm font-body focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors"
            placeholder="Cari judul kegiatan..."
          />
        </div>

        {/* Dropdown Filter Status */}
        <div className="relative w-full sm:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Funnel size={18} className="text-gray-400" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg bg-white text-sm font-body focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary appearance-none cursor-pointer transition-colors"
          >
            <option value="all">Semua Status</option>
            <option value="approved">Approved</option>
            <option value="submitted">Submitted</option>
            <option value="rejected">Rejected</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* Filter Tanggal */}
        <div className="relative w-full sm:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <CalendarBlank size={18} className="text-gray-400" />
          </div>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-sm font-body text-gray-600 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors cursor-text"
          />
        </div>
      </div>

      {/* Bagian Kanan: Tombol Cetak & Tambah */}
      <div className="flex flex-row items-center gap-3 w-full lg:w-auto justify-end font-body">
        <Button
          variant="outline"
          className="text-brand-primary border-brand-primary hover:bg-brand-primary/10 flex items-center gap-2 h-10 px-4 shadow-sm bg-white"
        >
          <Printer size={18} />
          <span className="hidden sm:inline">Cetak Laporan</span>
          <span className="sm:hidden">Cetak</span>
        </Button>
        
        {/* Tombol Tambah diarahkan ke halaman pembuatan logbook */}
        <Link href="/logbook/new">
          <Button
            className="bg-brand-accent hover:bg-orange-500 text-white flex items-center gap-2 h-10 px-4 shadow-sm border-none"
          >
            <Plus size={18} weight="bold" />
            <span className="hidden sm:inline">Tambah Entri</span>
            <span className="sm:hidden">Tambah</span>
          </Button>
        </Link>
      </div>

    </div>
  );
}