"use client";

import { useState } from "react";
import { LogbookFormData } from "@/types/entry";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/spinner";
import { FloppyDisk, X } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

interface EntryFormProps {
  initialData?: LogbookFormData; // Jika ada isinya, berarti mode Edit
  onSubmit: (data: LogbookFormData) => Promise<void>;
  isLoading: boolean;
}

export default function EntryForm({ initialData, onSubmit, isLoading }: EntryFormProps) {
  const router = useRouter();
  
  // State form. Kalau initialData ada (mode Edit), pakai data itu. Kalau tidak (mode Create), kosongkan.
  const [formData, setFormData] = useState<LogbookFormData>({
    activity_date: initialData?.activity_date 
      ? new Date(initialData.activity_date).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0], // Default hari ini
    title: initialData?.title || "",
    description: initialData?.description || "",
    obstacles: initialData?.obstacles || "",
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validasi sederhana
    if (!formData.title || !formData.description || !formData.activity_date) {
      setErrorMsg("Tanggal, Judul, dan Deskripsi wajib diisi!");
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat menyimpan data.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8 animate-fade-in-down font-body">
      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm">
          {errorMsg}
        </div>
      )}

      <div className="space-y-6">
        {/* Input Tanggal */}
        <div>
          <label htmlFor="activity_date" className="block text-sm font-semibold text-brand-dark mb-2">
            Tanggal Kegiatan <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="activity_date"
            name="activity_date"
            value={formData.activity_date}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors text-gray-700"
          />
        </div>

        {/* Input Judul */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-brand-dark mb-2">
            Judul Kegiatan <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Contoh: Implementasi API Logbook"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors text-gray-700"
          />
        </div>

        {/* Input Deskripsi */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-brand-dark mb-2">
            Deskripsi Pekerjaan <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Ceritakan detail apa saja yang kamu kerjakan hari ini..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors text-gray-700 resize-y"
          />
        </div>

        {/* Input Hambatan (Opsional) */}
        <div>
          <label htmlFor="obstacles" className="block text-sm font-semibold text-brand-dark mb-2">
            Hambatan (Opsional)
          </label>
          <textarea
            id="obstacles"
            name="obstacles"
            value={formData.obstacles}
            onChange={handleChange}
            rows={3}
            placeholder="Apakah ada kendala selama pengerjaan? (Kosongkan jika tidak ada)"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors text-gray-700 resize-y"
          />
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
          className="text-gray-600 border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2 h-11 px-6"
        >
          <X size={18} weight="bold" />
          Batal
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-brand-primary hover:bg-brand-dark text-white flex items-center justify-center gap-2 h-11 px-8 shadow-sm transition-colors"
        >
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              <FloppyDisk size={18} weight="bold" />
              Simpan Entri
            </>
          )}
        </Button>
      </div>
    </form>
  );
}