import { entrySchema } from "@/lib/validators/entry.schema";

describe("entrySchema", () => {
  const validData = {
    activity_date: "2024-07-22",
    title: "Implementasi API Logbook",
    description: "Mengerjakan endpoint CRUD untuk fitur logbook mahasiswa PKL.",
    obstacles: "",
  };

  // --- KASUS VALID ---
  it("harus valid dengan data yang benar", () => {
    expect(entrySchema.safeParse(validData).success).toBe(true);
  });

  it("harus valid tanpa field obstacles (opsional)", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { obstacles: _obstacles, ...withoutObstacles } = validData;
    expect(entrySchema.safeParse(withoutObstacles).success).toBe(true);
  });

  it("harus valid dengan obstacles diisi", () => {
    const result = entrySchema.safeParse({ ...validData, obstacles: "Koneksi VPN putus" });
    expect(result.success).toBe(true);
  });

  // --- ACTIVITY DATE ---
  it("harus gagal jika activity_date kosong", () => {
    const result = entrySchema.safeParse({ ...validData, activity_date: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Tanggal kegiatan wajib diisi");
    }
  });

  it("harus gagal jika activity_date bukan format tanggal valid", () => {
    const result = entrySchema.safeParse({ ...validData, activity_date: "bukan-tanggal" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Format tanggal tidak valid");
    }
  });

  // --- TITLE ---
  it("harus gagal jika title kosong", () => {
    const result = entrySchema.safeParse({ ...validData, title: "" });
    expect(result.success).toBe(false);
  });

  it("harus gagal jika title kurang dari 5 karakter", () => {
    const result = entrySchema.safeParse({ ...validData, title: "API" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Judul minimal 5 karakter");
    }
  });

  it("harus gagal jika title lebih dari 150 karakter", () => {
    const result = entrySchema.safeParse({ ...validData, title: "A".repeat(151) });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Judul maksimal 150 karakter");
    }
  });

  it("harus valid jika title tepat 5 karakter (batas minimum)", () => {
    expect(entrySchema.safeParse({ ...validData, title: "Rapat" }).success).toBe(true);
  });

  // --- DESCRIPTION ---
  it("harus gagal jika description kosong", () => {
    const result = entrySchema.safeParse({ ...validData, description: "" });
    expect(result.success).toBe(false);
  });

  it("harus gagal jika description kurang dari 10 karakter", () => {
    const result = entrySchema.safeParse({ ...validData, description: "Kerjain" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Deskripsi minimal 10 karakter, ceritakan lebih detail"
      );
    }
  });

  it("harus gagal jika description melebihi 2000 karakter", () => {
    const result = entrySchema.safeParse({ ...validData, description: "A".repeat(2001) });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Deskripsi maksimal 2000 karakter");
    }
  });

  // --- OBSTACLES ---
  it("harus gagal jika obstacles melebihi 500 karakter", () => {
    const result = entrySchema.safeParse({ ...validData, obstacles: "X".repeat(501) });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Hambatan maksimal 500 karakter");
    }
  });

  it("harus valid jika obstacles tepat 500 karakter (batas maksimum)", () => {
    const result = entrySchema.safeParse({ ...validData, obstacles: "X".repeat(500) });
    expect(result.success).toBe(true);
  });
});
