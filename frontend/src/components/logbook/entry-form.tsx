"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { entrySchema, EntryFormInput } from "@/lib/validators/entry.schema";
import { Button } from "@/components/ui/button";
import {
  FloppyDisk,
  X,
  CalendarBlank,
  TextAlignLeft,
  WarningCircle,
  Paperclip,
  PaperPlaneTilt,
} from "@phosphor-icons/react";
import { WarningIcon } from "@/components/ui/warning-icon";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import AttachmentUpload from "@/components/logbook/attachment-upload";

// ─── Types ───────────────────────────────────────────────────────────────────

type SubmitMode = "draft" | "submit";

interface EntryFormProps {
  initialData?: EntryFormInput;
  /** URL lampiran existing di server (untuk mode Edit) */
  existingAttachmentUrl?: string;
  existingFileName?: string;
  /** Dipanggil saat simpan sebagai draft atau simpan perubahan */
  onSave: (data: EntryFormInput & { remove_attachment?: boolean }, files: File[]) => Promise<void>;
  /** Dipanggil saat submit ke mentor (hanya mode create) */
  onSubmitEntry?: (data: EntryFormInput, files: File[]) => Promise<void>;
  isSaving?: boolean;
  isSubmitting?: boolean;
}

type FieldErrors = Partial<Record<keyof EntryFormInput, string>>;

// ─── Component ───────────────────────────────────────────────────────────────

export default function EntryForm({
  initialData,
  existingAttachmentUrl,
  existingFileName,
  onSave,
  onSubmitEntry,
  isSaving = false,
  isSubmitting = false,
}: EntryFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;
  const isBusy = isSaving || isSubmitting;

  // ─── Form state ────────────────────────────────────────────────────────

  const [formData, setFormData] = useState<EntryFormInput>({
    activity_date: initialData?.activity_date
      ? new Date(initialData.activity_date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    title: initialData?.title || "",
    description: initialData?.description || "",
    obstacles: initialData?.obstacles || "",
  });

  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [localExistingAttachmentUrl, setLocalExistingAttachmentUrl] = useState(existingAttachmentUrl);
  const [localExistingFileName, setLocalExistingFileName] = useState(existingFileName);
  const [isAttachmentRemoved, setIsAttachmentRemoved] = useState(false);

  // Sync dengan props jika berubah saat render (React recommended pattern)
  const [prevAttachmentProps, setPrevAttachmentProps] = useState({ existingAttachmentUrl, existingFileName });
  if (
    prevAttachmentProps.existingAttachmentUrl !== existingAttachmentUrl ||
    prevAttachmentProps.existingFileName !== existingFileName
  ) {
    setPrevAttachmentProps({ existingAttachmentUrl, existingFileName });
    setLocalExistingAttachmentUrl(existingAttachmentUrl);
    setLocalExistingFileName(existingFileName);
  }

  const handleRemoveExistingAttachment = () => {
    setLocalExistingAttachmentUrl(undefined);
    setLocalExistingFileName(undefined);
    setIsAttachmentRemoved(true);
  };

  // ─── Handlers ──────────────────────────────────────────────────────────

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof EntryFormInput]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): EntryFormInput | null => {
    setErrorMsg(null);
    setErrors({});

    const result = entrySchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        activity_date: fieldErrors.activity_date?.[0],
        title: fieldErrors.title?.[0],
        description: fieldErrors.description?.[0],
        obstacles: fieldErrors.obstacles?.[0],
      });
      return null;
    }
    return result.data;
  };

  const handleAction = async (mode: SubmitMode) => {
    const validData = validate();
    if (!validData) return;

    try {
      if (mode === "submit" && onSubmitEntry) {
        await onSubmitEntry(validData, attachedFiles);
      } else {
        const dataWithFlag = { ...validData, remove_attachment: isAttachmentRemoved };
        await onSave(dataWithFlag, attachedFiles);
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setErrorMsg(errorObj.message || "Terjadi kesalahan saat menyimpan data.");
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAction("draft");
  };

  // ─── Render ────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6 animate-fade-in-down font-body">
      {/* Error Banner */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-sm flex items-start gap-3">
          <WarningCircle size={18} weight="fill" className="mt-0.5 shrink-0 text-rose-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Card Utama */}
      <Card className="mb-6 border-gray-200">
        {/* Card Header */}
        <CardHeader className="px-6 sm:px-8 py-5 bg-gradient-to-r from-brand-primary to-brand-dark rounded-t-xl shadow-inner">
          <h2 className="text-base font-heading font-bold text-white">
            {isEdit ? "Edit Informasi Entri" : "Informasi Kegiatan"}
          </h2>
          <p className="text-xs text-brand-soft mt-0.5">
            Isi semua field yang bertanda bintang (*)
          </p>
        </CardHeader>

        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Tanggal */}
          <div>
            <label htmlFor="activity_date" className="block text-sm font-semibold text-brand-dark mb-2">
              <span className="flex items-center gap-2">
                <CalendarBlank size={16} className="text-brand-primary" />
                Tanggal Kegiatan <span className="text-rose-500">*</span>
              </span>
            </label>
            <input
              type="date"
              id="activity_date"
              name="activity_date"
              value={formData.activity_date}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary transition-all text-gray-700 bg-white shadow-sm ${
                errors.activity_date ? "border-rose-400 bg-rose-50/30" : "border-gray-200 hover:border-gray-300"
              }`}
            />
            {errors.activity_date && (
              <p className="text-rose-500 text-[11px] mt-1.5 font-medium flex items-center gap-1.5">
                <WarningIcon size={13} className="text-rose-500" /> {errors.activity_date}
              </p>
            )}
          </div>

          {/* Judul */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-brand-dark mb-2">
              Judul Kegiatan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Contoh: Implementasi Fitur Upload Dokumen"
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary transition-all text-gray-700 bg-white placeholder:text-gray-300 shadow-sm ${
                errors.title ? "border-rose-400 bg-rose-50/30" : "border-gray-200 hover:border-gray-300"
              }`}
            />
            {errors.title && (
              <p className="text-rose-500 text-[11px] mt-1.5 font-medium flex items-center gap-1.5">
                <WarningIcon size={13} className="text-rose-500" /> {errors.title}
              </p>
            )}
          </div>

          {/* Deskripsi */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-brand-dark mb-2">
              <span className="flex items-center gap-2">
                <TextAlignLeft size={16} className="text-brand-primary" />
                Deskripsi Pekerjaan <span className="text-rose-500">*</span>
              </span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Ceritakan secara detail apa saja yang kamu kerjakan hari ini, termasuk progres dan hasil yang dicapai..."
              className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary transition-all text-gray-700 resize-y bg-white placeholder:text-gray-300 leading-relaxed shadow-sm ${
                errors.description ? "border-rose-400 bg-rose-50/30" : "border-gray-200 hover:border-gray-300"
              }`}
            />
            <div className="flex items-center justify-between mt-1.5">
              {errors.description ? (
                <p className="text-rose-500 text-[11px] font-medium flex items-center gap-1.5">
                  <WarningIcon size={13} className="text-rose-500" /> {errors.description}
                </p>
              ) : (
                <span />
              )}
              <span
                className={`text-[11px] ml-auto ${
                  formData.description.length > 1800 ? "text-rose-500" : "text-gray-400"
                }`}
              >
                {formData.description.length}/2000
              </span>
            </div>
          </div>

          {/* Hambatan */}
          <div>
            <label htmlFor="obstacles" className="block text-sm font-semibold text-brand-dark mb-2">
              <span className="flex items-center gap-2">
                <WarningCircle size={16} className="text-amber-500" />
                Hambatan &amp; Kendala
                <span className="text-xs font-normal text-gray-400 ml-1">(Opsional)</span>
              </span>
            </label>
            <textarea
              id="obstacles"
              name="obstacles"
              value={formData.obstacles}
              onChange={handleChange}
              rows={3}
              placeholder="Apakah ada kendala selama pengerjaan? Kosongkan jika tidak ada."
              className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all text-gray-700 resize-y bg-white placeholder:text-gray-300 leading-relaxed shadow-sm ${
                errors.obstacles ? "border-rose-400 bg-rose-50/30" : "border-gray-200 hover:border-gray-300"
              }`}
            />
            {errors.obstacles && (
              <p className="text-rose-500 text-[11px] mt-1.5 font-medium flex items-center gap-1.5">
                <WarningIcon size={13} className="text-rose-500" /> {errors.obstacles}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Card Attachment */}
      <Card className="border-gray-200">
        <CardHeader className="px-6 sm:px-8 py-5 bg-gradient-to-r from-brand-accent to-orange-400 rounded-t-xl shadow-inner">
          <h2 className="text-base font-heading font-bold text-white flex items-center gap-2">
            <Paperclip size={18} className="text-white" />
            Lampiran
            <span className="text-xs font-normal text-white/80 ml-1">(Opsional)</span>
          </h2>
          <p className="text-xs text-brand-soft mt-0.5">
            Lampirkan bukti kerja berupa foto atau dokumen PDF
          </p>
        </CardHeader>

        <CardContent className="p-6 sm:p-8">
          <AttachmentUpload
            files={attachedFiles}
            onChange={setAttachedFiles}
            existingAttachmentUrl={localExistingAttachmentUrl}
            existingFileName={localExistingFileName}
            onRemoveExisting={handleRemoveExistingAttachment}
          />
        </CardContent>
      </Card>

      {/* Tombol Aksi */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2 pb-6">
        {/* Batal */}
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isBusy}
          className="text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-gray-700 gap-2 h-11 px-6 rounded-xl"
        >
          <X size={17} weight="bold" />
          Batal
        </Button>

        {/* Simpan Draft / Simpan Perubahan */}
        <Button
          type="submit"
          isLoading={isSaving}
          disabled={isBusy}
          className="bg-brand-dark hover:bg-brand-primary text-brand-white gap-2 h-11 px-8 rounded-xl shadow-sm"
        >
          <FloppyDisk size={18} weight="bold" />
          {isEdit ? "Simpan Perubahan" : "Simpan Draft"}
        </Button>

        {/* Submit ke Mentor (hanya mode create) */}
        {!isEdit && onSubmitEntry && (
          <Button
            type="button"
            isLoading={isSubmitting}
            disabled={isBusy}
            onClick={() => handleAction("submit")}
            className="bg-brand-primary hover:bg-brand-dark text-white gap-2 h-11 px-8 rounded-xl shadow-sm shadow-brand-primary/25"
          >
            <PaperPlaneTilt size={18} weight="bold" />
            Submit ke Mentor
          </Button>
        )}
      </div>
    </form>
  );
}