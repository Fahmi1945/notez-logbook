"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react";
import EntryForm from "@/components/logbook/entry-form";
import LogbookDetailSkeleton from "@/components/logbook/logbook-detail-skeleton";
import { EntryFormInput } from "@/lib/validators/entry.schema";
import { entriesApi } from "@/lib/api/entries";
import { LogbookEntry } from "@/types/entry";
import { useUIStore } from "@/store/ui-store";
import { MESSAGES } from "@/config/messages";

export default function EditLogbookPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const showToast = useUIStore((s) => s.showToast);
  
  const [entry, setEntry] = useState<LogbookEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const res = await entriesApi.getById(id);
        setEntry(res.data);
      } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } } };
        setError(e.response?.data?.message || MESSAGES.LOGBOOK.FETCH_FAILED);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  const handleSave = async (data: EntryFormInput & { remove_attachment?: boolean }, files: File[]) => {
    if (!entry) return;
    setIsSaving(true);
    try {
      await entriesApi.update(entry.id, data, files);
      showToast(MESSAGES.LOGBOOK.UPDATE_SUCCESS, "success");
      router.push("/logbook");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      showToast(e.response?.data?.message || MESSAGES.LOGBOOK.ACTION_FAILED, "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <LogbookDetailSkeleton />
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="p-6 max-w-4xl mx-auto font-body mt-10">
        <div className="text-center p-10 bg-rose-50 text-rose-600 rounded-2xl border border-rose-200 animate-fade-in-down shadow-sm">
          <p className="font-heading font-bold text-lg mb-2">Terjadi Kesalahan</p>
          <p className="text-sm mb-6 text-rose-500">{error || "Data logbook tidak ditemukan."}</p>
          <Link
            href="/logbook"
            className="inline-flex px-6 py-2.5 bg-white border border-rose-200 rounded-xl text-sm hover:bg-rose-50 transition-colors font-medium text-rose-700 shadow-sm"
          >
            Kembali ke Daftar
          </Link>
        </div>
      </div>
    );
  }

  const initialData = {
    activity_date: entry.activity_date,
    title: entry.title,
    description: entry.description,
    obstacles: entry.obstacles || "",
  };

  const existingAttachment = entry.attachments?.[0];

  return (
    <div className="p-6 max-w-4xl mx-auto font-body">
      <div className="mb-6 animate-fade-in-down">
        <Link
          href="/logbook"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-brand-primary mb-4 transition-colors font-medium"
        >
          <ArrowLeft size={16} weight="bold" />
          Kembali ke Manajemen Logbook
        </Link>
        <h1 className="text-2xl font-heading font-bold text-brand-dark mb-1">
          Edit Logbook
        </h1>
        <p className="text-gray-400 text-sm">
          Perbarui entri logbook yang belum disubmit.
        </p>
      </div>

      <EntryForm
        initialData={initialData}
        existingAttachmentUrl={existingAttachment ? `/api/proxy/attachments/${existingAttachment.id}` : undefined}
        existingFileName={existingAttachment?.file_name}
        onSave={handleSave}
        onCancel={() => router.back()}
        isSaving={isSaving}
      />
    </div>
  );
}
