"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import EntryForm from "@/components/logbook/entry-form";
import { entriesApi } from "@/lib/api/entries";
import { LogbookFormData } from "@/types/entry";
import { ArrowLeft } from "@phosphor-icons/react";
import Link from "next/link";

export default function NewLogbookPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fungsi untuk menangani proses submit dari form
  const handleSubmit = async (data: LogbookFormData) => {
    setIsSubmitting(true);
    try {
      // Tembak endpoint POST /logbook
      await entriesApi.create(data);
      
      // Jika sukses, arahkan kembali ke halaman utama logbook
      router.push("/logbook");
      
      // Memaksa Next.js untuk me-refresh cache halaman agar data terbaru langsung muncul
      router.refresh(); 
    } catch (error: any) {
      setIsSubmitting(false);
      // Lempar error ke komponen form agar pesan errornya muncul di UI
      throw new Error(error.message || "Gagal menyimpan logbook. Silakan coba lagi.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto font-body">
      {/* Header Halaman */}
      <div className="mb-6 animate-fade-in-down">
        {/* Tombol Back */}
        <Link 
          href="/logbook" 
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-primary mb-4 transition-colors font-medium"
        >
          <ArrowLeft size={16} weight="bold" />
          Kembali ke Manajemen Logbook
        </Link>
        
        <h1 className="text-2xl font-heading font-bold text-brand-dark mb-2">
          Tambah Entri Baru
        </h1>
        <p className="text-gray-500 text-sm">
          Catat detail aktivitas atau progres bimbinganmu di sini. Pastikan deskripsi diisi dengan jelas.
        </p>
      </div>

      {/* Panggil Komponen Form */}
      <EntryForm 
        onSubmit={handleSubmit} 
        isLoading={isSubmitting} 
      />
    </div>
  );
}