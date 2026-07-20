"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { entriesApi } from "@/lib/api/entries";
import { LogbookEntry } from "@/types/entry";
import { Spinner } from "@/components/ui/spinner"; // Pastikan path ini sesuai
import { ArrowLeft, CalendarBlank, WarningCircle } from "@phosphor-icons/react";

export default function LogbookDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [entry, setEntry] = useState<LogbookEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ambil data spesifik berdasarkan ID dari URL
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const res = await entriesApi.getById(id);
        setEntry(res.data);
      } catch (err: any) {
        setError(err.message || "Gagal mengambil detail logbook.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchDetail();
    }
  }, [id]);

  // FIX: Tambahkan opsional parameter (?) dan fallback string kosong ("")
  // Biar kalau API nge-return status: null, aplikasinya nggak meledak pas kena toLowerCase()
  const getStatusBadge = (status?: string) => {
    switch ((status || "").toLowerCase()) {
      case "approved":
        return <span className="badge-approved px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1 font-body w-max">✓ Approved</span>;
      case "submitted":
      case "pending":
        return <span className="badge-submitted px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1 font-body w-max">⏱ Submitted</span>;
      case "rejected":
        return <span className="badge-rejected px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1 font-body w-max">✕ Rejected</span>;
      default:
        return <span className="badge-draft px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1 font-body w-max">📝 Draft</span>;
    }
  };

  // State Loading
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Spinner />
        <p className="text-sm text-gray-500 mt-4 font-body animate-pulse">Memuat detail entri...</p>
      </div>
    );
  }

  // State Error
  if (error || !entry) {
    return (
      <div className="p-6 max-w-4xl mx-auto font-body mt-10">
        <div className="text-center p-8 bg-red-50 text-red-600 rounded-xl border border-red-200 animate-fade-in-down shadow-sm">
          <p className="font-heading font-bold text-lg mb-2">Terjadi Kesalahan</p>
          <p className="text-sm mb-6">{error || "Data logbook tidak ditemukan."}</p>
          <Link 
            href="/logbook" 
            className="inline-flex px-6 py-2.5 bg-white border border-red-200 rounded-lg text-sm hover:bg-red-100 transition-colors font-medium text-red-700 shadow-sm"
          >
            Kembali ke Daftar
          </Link>
        </div>
      </div>
    );
  }

  // State Sukses (Tampilan Utama)
  return (
    <div className="p-6 max-w-4xl mx-auto font-body animate-fade-in-down">
      {/* Header Halaman */}
      <div className="mb-6">
        <Link 
          href="/logbook" 
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-primary mb-4 transition-colors font-medium"
        >
          <ArrowLeft size={16} weight="bold" />
          Kembali ke Manajemen Logbook
        </Link>
      </div>

      {/* Card Konten Detail */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        
        {/* Bagian Kop (Atas) */}
        <div className="p-6 sm:p-8 border-b border-gray-100 bg-brand-white">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
            <div>
              <h1 className="text-2xl font-heading font-bold text-brand-dark mb-4 leading-tight">
                {/* Fallback juga untuk title berjaga-jaga */}
                {entry.title || "Tidak ada judul"}
              </h1>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-600 font-medium text-sm shadow-sm">
                <CalendarBlank size={18} weight="regular" className="text-brand-primary" />
                {entry.activity_date ? new Date(entry.activity_date).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }) : "-"}
              </div>
            </div>
            <div className="flex-shrink-0">
              {/* Ini akan aman memanggil getStatusBadge walaupun entry.status undefined */}
              {getStatusBadge(entry.status)}
            </div>
          </div>
        </div>

        {/* Bagian Isi (Bawah) */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Section Deskripsi */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
              Deskripsi Pekerjaan
            </h3>
            <div className="p-5 bg-brand-white-bg rounded-lg border border-gray-100 text-gray-700 leading-relaxed whitespace-pre-wrap">
              {entry.description || "Tidak ada deskripsi."}
            </div>
          </div>

          {/* Section Hambatan (Hanya tampil jika field tidak kosong) */}
          {entry.obstacles && (
            <div>
              <h3 className="text-sm font-semibold text-status-rejected mb-3 uppercase tracking-wider flex items-center gap-2">
                <WarningCircle size={18} weight="fill" />
                Hambatan & Kendala
              </h3>
              <div className="p-5 bg-red-50 rounded-lg border border-red-100 text-red-700 leading-relaxed whitespace-pre-wrap">
                {entry.obstacles}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}