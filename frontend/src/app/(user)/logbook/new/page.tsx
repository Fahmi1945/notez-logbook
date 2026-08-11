"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, WarningCircle } from "@phosphor-icons/react";
import Link from "next/link";
import EntryForm from "@/components/logbook/entry-form";
import { EntryFormInput } from "@/lib/validators/entry.schema";
import { entriesApi } from "@/lib/api/entries";
import { useUIStore } from "@/store/ui-store";
import { MESSAGES } from "@/config/messages";
import { useMentorStatus } from "@/hooks/use-mentor-status";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

export default function NewLogbookPage() {
  const router = useRouter();
  const showToast = useUIStore((s) => s.showToast);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { hasActiveMentor, isLoading: isCheckingMentor } = useMentorStatus();

  // Guard 1: Cek status mentor sedang di-load
  if (isCheckingMentor) {
    return (
      <div className="p-6 max-w-4xl mx-auto flex justify-center items-center min-h-64">
        <Spinner />
      </div>
    );
  }

  // Guard 2: Tidak ada mentor aktif — tampil blocking screen (Opsi B)
  if (hasActiveMentor === false) {
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
        </div>
        <div className="mt-4 text-center p-10 bg-amber-50 border border-amber-200 rounded-2xl shadow-sm animate-fade-in-down">
          <WarningCircle size={52} weight="fill" className="text-amber-400 mx-auto mb-5" />
          <h2 className="text-xl font-heading font-bold text-amber-800 mb-2">
            {MESSAGES.LOGBOOK.NO_ACTIVE_MENTOR}
          </h2>
          <p className="text-sm text-amber-600 mb-8 max-w-sm mx-auto leading-relaxed">
            {MESSAGES.LOGBOOK.NO_ACTIVE_MENTOR_DESC}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/mentorship">
              <Button className="bg-brand-primary hover:bg-brand-dark text-white px-6 h-10 rounded-xl shadow-sm shadow-brand-primary/20">
                Cari &amp; Ajukan Mentor
              </Button>
            </Link>
            <Link href="/logbook">
              <Button variant="outline" className="px-6 h-10 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50">
                Kembali ke Logbook
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Form Logbook (hanya tampil jika sudah punya mentor aktif)
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
