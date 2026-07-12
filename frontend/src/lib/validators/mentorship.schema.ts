import { z } from "zod";

export const mentorshipRequestSchema = z.object({
  mentorId: z
    .number({
      message: "ID Mentor wajib dipilih.",
    })
    .int("ID Mentor harus berupa angka.")
    .positive("ID Mentor tidak valid."),
  
  information: z
    .string()
    .max(255, "Pesan informasi maksimal 255 karakter.")
    .optional(),
});

export type MentorshipRequestInput = z.infer<typeof mentorshipRequestSchema>;