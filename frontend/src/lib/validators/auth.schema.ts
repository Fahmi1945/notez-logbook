import { z } from "zod";

// 1. Skema Validasi untuk Login
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email wajib diisi" })
        .email({ message: "Format email tidak valid" }),
    password: z
        .string()
        .min(1, { message: "Password wajib diisi" })
        .min(6, { message: "Password minimal 6 karakter" }),
});

// 2. Skema Validasi untuk Register
export const registerSchema = z.object({
    name: z
        .string()
        .min(1, { message: "Nama lengkap wajib diisi" })
        .min(3, { message: "Nama minimal 3 karakter" }),
    email: z
        .string()
        .min(1, { message: "Email wajib diisi" })
        .email({ message: "Format email tidak valid" }),
    role: z.enum(["user", "mentor"], {
        message: "Peran harus berupa 'user' atau 'mentor'",
    }),
    password: z
        .string()
        .min(1, { message: "Password wajib diisi" })
        .min(6, { message: "Password minimal 6 karakter" }),
    confirmPassword: z
        .string()
        .min(1, { message: "Konfirmasi password wajib diisi" }),
})
    // Superpower Zod: Mengecek kecocokan dua field secara otomatis
    .refine((data) => data.password === data.confirmPassword, {
        message: "Password dan konfirmasi password tidak cocok",
        path: ["confirmPassword"], // Menentukan field mana yang akan menerima pesan error ini
    });

// 3. Export Type (Keajaiban Zod untuk TypeScript)
// Alih-alih membuat interface manual, kita suruh Zod membuatkannya untuk kita!
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;