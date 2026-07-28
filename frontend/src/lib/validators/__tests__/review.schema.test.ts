import { reviewActionSchema } from "@/lib/validators/review.schema";

describe("reviewActionSchema", () => {
  // --- Kasus VALID: approved ---
  it("harus valid jika status approved tanpa comment", () => {
    const result = reviewActionSchema.safeParse({ status: "approved" });
    expect(result.success).toBe(true);
  });

  it("harus valid jika status approved dengan comment diisi", () => {
    const result = reviewActionSchema.safeParse({
      status: "approved",
      comment: "Kerja bagus, lanjutkan!",
    });
    expect(result.success).toBe(true);
  });

  // --- Kasus VALID: rejected ---
  it("harus valid jika status rejected dengan comment diisi", () => {
    const result = reviewActionSchema.safeParse({
      status: "rejected",
      comment: "Deskripsi kurang detail, mohon direvisi.",
    });
    expect(result.success).toBe(true);
  });

  // --- Kasus TIDAK VALID ---
  it("harus gagal jika status rejected tanpa comment", () => {
    const result = reviewActionSchema.safeParse({ status: "rejected" });
    expect(result.success).toBe(false);
  });

  it("harus gagal jika status rejected dengan comment kosong", () => {
    const result = reviewActionSchema.safeParse({ status: "rejected", comment: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Catatan wajib diisi saat menolak entri"
      );
    }
  });

  it("harus gagal jika comment melebihi 500 karakter (approved)", () => {
    const result = reviewActionSchema.safeParse({
      status: "approved",
      comment: "a".repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it("harus gagal jika comment melebihi 500 karakter (rejected)", () => {
    const result = reviewActionSchema.safeParse({
      status: "rejected",
      comment: "a".repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it("harus valid jika comment tepat 500 karakter (batas maksimum)", () => {
    const result = reviewActionSchema.safeParse({
      status: "rejected",
      comment: "a".repeat(500),
    });
    expect(result.success).toBe(true);
  });

  it("harus gagal jika status tidak dikenal", () => {
    const result = reviewActionSchema.safeParse({ status: "pending" });
    expect(result.success).toBe(false);
  });

  it("harus gagal jika status tidak ada", () => {
    const result = reviewActionSchema.safeParse({ comment: "test" });
    expect(result.success).toBe(false);
  });
});