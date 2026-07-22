"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import EntryForm from "@/components/logbook/entry-form";
import { entriesApi } from "@/lib/api/entries";
import { LogbookFormData } from "@/types/entry";
import { ArrowLeft } from "@phosphor-icons/react";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";

export default function EditLogbookPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [initialData, setInitialData] = useState<LogbookFormData | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Ambil data logbook lama saat halaman pertama kali dimuat
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsFetching(true);
        const res = await entriesApi.getById(id);
        
        // Sesuaikan format data dari API ke format form
        setInitialData({
          activity_date: res.data.activity_date,
          title: res.data.title,
          description: res.data.description,
          obstacles: res.data.obstacles || "",
        });
      } catch (err: unknown) {
        const errorObj = err as { message?: string };
        setFetchError(errorObj.message || "Gagal mengambil data logbook.");
      } finally {
        setIsFetching(false);
      }
    };

    if (id) {
      fetchDetail();
    }
  }, [id]);

  // Fungsi untuk menangani proses submit (Update data)
  const handleSubmit = async (data: LogbookFormData) => {
    setIsSubmitting(true);
    try {
      // Tembak endpoint PUT /logbook/:id
      await entriesApi.update(id, data);
      
      // Jika sukses, arahkan kembali ke halaman utama logbook
      router.push("/logbook");
      router.refresh(); 
    } catch (error: unknown) {
      const errorObj = error as { message?: string };
      setIsSubmitting(false);
      throw new Error(errorObj.message || "Gagal memperbarui logbook. Silakan coba lagi.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto font-body">
      {/* Header Halaman */}
      <div className="mb-6 animate-fade-in-down">
        <Link 
          href="/logbook" 
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-accent mb-4 transition-colors font-medium"
        >
          <ArrowLeft size={16} weight="bold" />
          Batal & Kembali
        </Link>
        
        <h1 className="text-2xl font-heading font-bold text-brand-dark mb-2">
          Edit Entri Logbook
        </h1>
        <p className="text-gray-500 text-sm">
          Perbarui detail aktivitas bimbinganmu. Pastikan perbaikan sesuai dengan catatan revisi (jika ada).
        </p>
      </div>

      {/* Tampilan Loading saat mengambil data */}
      {isFetching ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-200">
          <Spinner />
          <p className="text-sm text-gray-500 mt-4">Memuat data entri...</p>
        </div>
      ) : fetchError ? (
        /* Tampilan Error jika gagal mengambil data (misal ID tidak ditemukan) */
        <div className="text-center p-8 bg-red-50 text-red-600 rounded-xl border border-red-200 animate-fade-in-down">
          <p className="font-semibold mb-2">Terjadi Kesalahan</p>
          <p className="text-sm mb-4">{fetchError}</p>
          <button 
            onClick={() => router.push("/logbook")}
            className="px-4 py-2 bg-white border border-red-200 rounded-lg text-sm hover:bg-red-50"
          >
            Kembali ke Daftar
          </button>
        </div>
      ) : (
        /* Render form hanya jika data sudah berhasil diambil */
        initialData && (
          <EntryForm 
            initialData={initialData} 
            onSubmit={handleSubmit} 
            isLoading={isSubmitting} 
          />
        )
      )}
    </div>
  );
}