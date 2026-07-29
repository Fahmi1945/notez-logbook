"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import EntryForm from "@/components/logbook/entry-form";
import { entriesApi } from "@/lib/api/entries";
import { EntryFormInput } from "@/lib/validators/entry.schema";
import { ArrowLeft } from "@phosphor-icons/react";
import Link from "next/link";
import LogbookFormSkeleton from "@/components/logbook/logbook-form-skeleton";

export default function EditLogbookPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [initialData, setInitialData] = useState<EntryFormInput | null>(null);
  const [existingAttachmentUrl, setExistingAttachmentUrl] = useState<string | undefined>();
  const [existingFileName, setExistingFileName] = useState<string | undefined>();
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsFetching(true);
        const res = await entriesApi.getById(id);
        setInitialData({
          activity_date: res.data.activity_date,
          title: res.data.title,
          description: res.data.description,
          obstacles: res.data.obstacles || "",
        });
        // Simpan info lampiran existing jika ada
        if (res.data.attachments && res.data.attachments.length > 0) {
          const att = res.data.attachments[0];
          setExistingAttachmentUrl(`/api/proxy/attachments/${att.id}`);
          setExistingFileName(att.file_name);
        }
      } catch (err: unknown) {
        const errorObj = err as { message?: string };
        setFetchError(errorObj.message || "Gagal mengambil data logbook.");
      } finally {
        setIsFetching(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  const handleSave = async (data: EntryFormInput, files: File[]) => {
    setIsSaving(true);
    try {
      await entriesApi.update(id, data, files);
      router.push("/logbook");
      router.refresh();
    } catch (error: unknown) {
      const errorObj = error as { message?: string };
      setIsSaving(false);
      throw new Error(errorObj.message || "Gagal memperbarui logbook. Silakan coba lagi.");
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
          Batal & Kembali
        </Link>

        <h1 className="text-2xl font-heading font-bold text-brand-dark mb-1">
          Edit Entri Logbook
        </h1>
        <p className="text-gray-400 text-sm">
          Perbarui detail aktivitas bimbinganmu. Pastikan perbaikan sesuai dengan catatan revisi (jika ada).
        </p>
      </div>

      {isFetching ? (
        <LogbookFormSkeleton />
      ) : fetchError ? (
        <div className="text-center p-10 bg-rose-50 text-rose-600 rounded-2xl border border-rose-200 animate-fade-in-down">
          <p className="font-semibold mb-2 font-heading">Terjadi Kesalahan</p>
          <p className="text-sm mb-5 text-rose-500">{fetchError}</p>
          <button
            onClick={() => router.push("/logbook")}
            className="px-5 py-2.5 bg-white border border-rose-200 rounded-xl text-sm hover:bg-rose-50 transition-colors font-medium text-rose-600"
          >
            Kembali ke Daftar
          </button>
        </div>
      ) : (
        initialData && (
          <EntryForm
            initialData={initialData}
            existingAttachmentUrl={existingAttachmentUrl}
            existingFileName={existingFileName}
            onSave={handleSave}
            isSaving={isSaving}
          />
        )
      )}
    </div>
  );
}