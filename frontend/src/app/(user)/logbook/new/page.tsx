"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react";
import Link from "next/link";
import EntryForm from "@/components/logbook/entry-form";
import { EntryFormInput } from "@/lib/validators/entry.schema";
import { entriesApi } from "@/lib/api/entries";
import { useUIStore } from "@/store/ui-store";
import { MESSAGES } from "@/config/messages";

export default function NewLogbookPage() {
  const router = useRouter();
  const showToast = useUIStore((s) => s.showToast);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (data: EntryFormInput, files: File[]) => {
    setIsSaving(true);
    try {
      await entriesApi.create(data, files);
      showToast(MESSAGES.LOGBOOK.CREATE_SUCCESS, "success");
      router.push("/logbook");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      showToast(e.response?.data?.message || MESSAGES.LOGBOOK.ACTION_FAILED, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitEntry = async (data: EntryFormInput, files: File[]) => {
    setIsSubmitting(true);
    try {
      const res = await entriesApi.create(data, files);
      await entriesApi.submit(res.data.id);
      showToast(MESSAGES.LOGBOOK.SUBMIT_SUCCESS, "success");
      router.push("/logbook");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      showToast(e.response?.data?.message || MESSAGES.LOGBOOK.ACTION_FAILED, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          Tambah Logbook Baru
        </h1>
        <p className="text-gray-400 text-sm">
          Catat aktivitas bimbingan Anda hari ini.
        </p>
      </div>

      <EntryForm
        onSave={handleSave}
        onSubmitEntry={handleSubmitEntry}
        onCancel={() => router.back()}
        isSaving={isSaving}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
