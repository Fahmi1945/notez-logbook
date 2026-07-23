"use client";

import { useState } from "react";
import { entrySchema, EntryFormInput } from "@/lib/validators/entry.schema";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { FloppyDisk, X, CalendarBlank, TextAlignLeft, WarningCircle, Paperclip } from "@phosphor-icons/react";
import { WarningIcon } from "@/components/ui/warning-icon";
import { useRouter } from "next/navigation";
import AttachmentUpload from "@/components/logbook/attachment-upload";

interface EntryFormProps {
  initialData?: EntryFormInput;
  /** URL lampiran existing di server (untuk mode Edit) */
  existingAttachmentUrl?: string;
  existingFileName?: string;
  onSubmit: (data: EntryFormInput, files: File[]) => Promise<void>;
  isLoading: boolean;
}

type FieldErrors = Partial<Record<keyof EntryFormInput, string>>;

export default function EntryForm({ initialData, existingAttachmentUrl, existingFileName, onSubmit, isLoading }: EntryFormProps) {
  const router = useRouter();

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof EntryFormInput]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setErrors({});

    const validation = entrySchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors({
        activity_date: fieldErrors.activity_date?.[0],
        title: fieldErrors.title?.[0],
        description: fieldErrors.description?.[0],
        obstacles: fieldErrors.obstacles?.[0],
      });
      return;
    }

    try {
      await onSubmit(validation.data, attachedFiles);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setErrorMsg(errorObj.message || "Terjadi kesalahan saat menyimpan data.");
    }
  };

  const isEdit = !!initialData;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-down font-body">
      {/* Error Banner */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-sm flex items-start gap-3">
          <WarningCircle size={18} weight="fill" className="mt-0.5 shrink-0 text-rose-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Card Utama */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-gray-100 bg-gradient-to-r from-brand-primary/5 to-transparent">
          <h2 className="text-base font-heading font-bold text-brand-dark">
            {isEdit ? "Edit Informasi Entri" : "Informasi Kegiatan"}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">Isi semua field yang bertanda bintang (*)</p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Baris: Tanggal */}
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
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all text-gray-700 bg-white ${
                errors.activity_date ? "border-rose-400 bg-rose-50/30" : "border-gray-200 hover:border-gray-300"
              }`}
            />
            {errors.activity_date && (
              <p className="text-rose-500 text-[11px] mt-1.5 font-medium flex items-center gap-1.5">
                <WarningIcon size={13} className="text-rose-500" /> {errors.activity_date}
              </p>
            )}
          </div>

          {/* Baris: Judul */}
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
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all text-gray-700 bg-white placeholder:text-gray-300 ${
                errors.title ? "border-rose-400 bg-rose-50/30" : "border-gray-200 hover:border-gray-300"
              }`}
            />
            {errors.title && (
              <p className="text-rose-500 text-[11px] mt-1.5 font-medium flex items-center gap-1.5">
                <WarningIcon size={13} className="text-rose-500" /> {errors.title}
              </p>
            )}
          </div>

          {/* Baris: Deskripsi */}
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
              className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all text-gray-700 resize-y bg-white placeholder:text-gray-300 leading-relaxed ${
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
              <span className={`text-[11px] ml-auto ${formData.description.length > 1800 ? "text-rose-500" : "text-gray-400"}`}>
                {formData.description.length}/2000
              </span>
            </div>
          </div>

          {/* Baris: Hambatan */}
          <div>
            <label htmlFor="obstacles" className="block text-sm font-semibold text-brand-dark mb-2">
              <span className="flex items-center gap-2">
                <WarningCircle size={16} className="text-amber-500" />
                Hambatan & Kendala
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
              className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all text-gray-700 resize-y bg-white placeholder:text-gray-300 leading-relaxed ${
                errors.obstacles ? "border-rose-400 bg-rose-50/30" : "border-gray-200 hover:border-gray-300"
              }`}
            />
            {errors.obstacles && (
              <p className="text-rose-500 text-[11px] mt-1.5 font-medium flex items-center gap-1.5">
                <WarningIcon size={13} className="text-rose-500" /> {errors.obstacles}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Card Attachment */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 sm:px-8 py-5 border-b border-gray-100 bg-gradient-to-r from-brand-accent/5 to-transparent">
          <h2 className="text-base font-heading font-bold text-brand-dark flex items-center gap-2">
            <Paperclip size={18} className="text-brand-accent" />
            Lampiran
            <span className="text-xs font-normal text-gray-400 ml-1">(Opsional)</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">Lampirkan bukti kerja berupa foto atau dokumen PDF</p>
        </div>

        <div className="p-6 sm:p-8">
          <AttachmentUpload
            files={attachedFiles}
            onChange={setAttachedFiles}
            existingAttachmentUrl={existingAttachmentUrl}
            existingFileName={existingFileName}
          />
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2 pb-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
          className="text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-gray-700 flex items-center justify-center gap-2 h-11 px-6 rounded-xl transition-all"
        >
          <X size={17} weight="bold" />
          Batal
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-brand-primary hover:bg-brand-dark text-white flex items-center justify-center gap-2 h-11 px-8 rounded-xl shadow-sm shadow-brand-primary/25 transition-all disabled:opacity-70"
        >
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              <FloppyDisk size={18} weight="bold" />
              {isEdit ? "Simpan Perubahan" : "Simpan Entri"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}