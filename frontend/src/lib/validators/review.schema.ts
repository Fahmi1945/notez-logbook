import { z } from "zod";

export const reviewActionSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("approved"),
    comment: z
      .string()
      .max(500, { message: "Catatan maksimal 500 karakter" })
      .optional(),
  }),
  z.object({
    status: z.literal("rejected"),
    comment: z
      .string()
      .min(1, { message: "Catatan wajib diisi saat menolak entri" })
      .max(500, { message: "Catatan maksimal 500 karakter" }),
  }),
]);

export type ReviewActionInput = z.infer<typeof reviewActionSchema>;