import { mentorshipRequestSchema } from "@/lib/validators/mentorship.schema";

describe("mentorshipRequestSchema", () => {
  // --- Kasus VALID ---
  it("harus valid jika mentorId adalah angka positif", () => {
    const result = mentorshipRequestSchema.safeParse({ mentorId: 1 });
    expect(result.success).toBe(true);
  });

  it("harus valid jika mentorId positif dan information diisi", () => {
    const result = mentorshipRequestSchema.safeParse({
      mentorId: 5,
      information: "Saya ingin belajar React",
    });
    expect(result.success).toBe(true);
  });

  it("harus valid jika information tidak diisi (optional)", () => {
    const result = mentorshipRequestSchema.safeParse({ mentorId: 3 });
    expect(result.success).toBe(true);
  });

  // --- Kasus TIDAK VALID ---
  it("harus gagal jika mentorId tidak ada", () => {
    const result = mentorshipRequestSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("harus gagal jika mentorId adalah 0 (bukan angka positif)", () => {
    const result = mentorshipRequestSchema.safeParse({ mentorId: 0 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("ID Mentor tidak valid.");
    }
  });

  it("harus gagal jika mentorId adalah angka negatif", () => {
    const result = mentorshipRequestSchema.safeParse({ mentorId: -5 });
    expect(result.success).toBe(false);
  });

  it("harus gagal jika mentorId adalah string", () => {
    const result = mentorshipRequestSchema.safeParse({ mentorId: "abc" });
    expect(result.success).toBe(false);
  });

  it("harus gagal jika information melebihi 255 karakter", () => {
    const result = mentorshipRequestSchema.safeParse({
      mentorId: 1,
      information: "a".repeat(256),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Pesan informasi maksimal 255 karakter."
      );
    }
  });

  it("harus valid jika information tepat 255 karakter (batas maksimum)", () => {
    const result = mentorshipRequestSchema.safeParse({
      mentorId: 1,
      information: "a".repeat(255),
    });
    expect(result.success).toBe(true);
  });
});
