import { z } from "zod";

export const entrySchema = z.object({
  activity_date: z
    .string()
    .min(1, { message: "Tanggal kegiatan wajib diisi" })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Format tanggal tidak valid",
    }),

  title: z
    .string()
    .min(1, { message: "Judul kegiatan wajib diisi" })
    .min(5, { message: "Judul minimal 5 karakter" })
    .max(150, { message: "Judul maksimal 150 karakter" }),

  description: z
    .string()
    .min(1, { message: "Deskripsi pekerjaan wajib diisi" })
    .min(10, { message: "Deskripsi minimal 10 karakter, ceritakan lebih detail" })
    .max(2000, { message: "Deskripsi maksimal 2000 karakter" }),

  obstacles: z
    .string()
    .max(500, { message: "Hambatan maksimal 500 karakter" })
    .optional()
    .or(z.literal("")),
});

export type EntryFormInput = z.infer<typeof entrySchema>;