"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import EntryForm from "@/components/logbook/entry-form";
import { entriesApi } from "@/lib/api/entries";
import { EntryFormInput } from "@/lib/validators/entry.schema";
import { ArrowLeft } from "@phosphor-icons/react";
import Link from "next/link";

export default function NewLogbookPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: EntryFormInput, files: File[]) => {
    setIsSubmitting(true);
    try {
      await entriesApi.create(data, files);
      router.push("/logbook");
      router.refresh();
    } catch (error: unknown) {
      const errorObj = error as { message?: string };
      setIsSubmitting(false);
      throw new Error(errorObj.message || "Gagal menyimpan logbook. Silakan coba lagi.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto font-body">
      {/* Header */}
      <div className="mb-6 animate-fade-in-down">
        <Link
          href="/logbook"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-brand-primary mb-5 transition-colors font-medium"
        >
          <ArrowLeft size={16} weight="bold" />
          Kembali ke Manajemen Logbook
        </Link>

        <h1 className="text-2xl font-heading font-bold text-brand-dark mb-1">
          Tambah Entri Baru
        </h1>
        <p className="text-gray-400 text-sm">
          Catat detail aktivitas atau progres bimbinganmu. Pastikan deskripsi diisi dengan jelas.
        </p>
      </div>

      <EntryForm onSubmit={handleSubmit} isLoading={isSubmitting} />
    </div>
  );
}