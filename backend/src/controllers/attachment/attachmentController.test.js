// attachmentController.test.js

// 1. MOCKING PRISMA (Memalsukan Database)
const mockPrismaClient = {
  attachment: {
    findUnique: jest.fn(),
  },
  mentorship: {
    findFirst: jest.fn(),
  },
};
jest.mock("@prisma/client", () => {
  return { PrismaClient: jest.fn(() => mockPrismaClient) };
});

// 2. MOCKING SUPABASE (Memalsukan Storage Awan)
const mockSupabase = {
  storage: {
    from: jest.fn().mockReturnThis(), // Agar bisa chaining: from().createSignedUrl()
    createSignedUrl: jest.fn(),
    remove: jest.fn(),
  },
};
// Sesuaikan path ini dengan path asli supabase.js milikmu!
jest.mock("../../config/supabase", () => mockSupabase); 

// Import Controller yang mau dites
// Sesuaikan path ini dengan lokasi file attachmentController.js milikmu
const { viewAttachment, deleteSupabaseAttachments } = require("./attachmentController"); 

describe("Attachment Controller Tests", () => {
  
  // Helper untuk memalsukan Request & Response Express
  let req, res;
  beforeEach(() => {
    req = { params: {}, user: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks(); // Bersihkan memori mock sebelum tiap test
  });

  describe("viewAttachment()", () => {
    
    it("Harus mereturn 404 jika attachment tidak ditemukan di database", async () => {
      req.params.id = "1";
      req.user = { id: 10, role: "user" };

      // Simulasi Prisma mereturn null (data kosong)
      mockPrismaClient.attachment.findUnique.mockResolvedValue(null);

      await viewAttachment(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Attachment not found" });
    });

    it("Harus mereturn 403 (Forbidden) jika user mencoba melihat file orang lain", async () => {
      req.params.id = "1";
      req.user = { id: 10, role: "user" }; // User yang sedang login (ID: 10)

      // Simulasi Prisma mereturn file milik orang lain (ID: 99)
      mockPrismaClient.attachment.findUnique.mockResolvedValue({
        id: 1,
        logbook_entry: { user_id: 99 } 
      });

      await viewAttachment(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: "FORBIDDEN",
        message: "Unauthorized"
      });
    });

    it("Harus sukses (200) dan mereturn Signed URL jika pemilik asli yang mengakses", async () => {
      req.params.id = "1";
      req.user = { id: 10, role: "user" };

      // Simulasi Prisma mereturn file yang VALID milik user ID: 10
      mockPrismaClient.attachment.findUnique.mockResolvedValue({
        id: 1,
        file_path: "https://xyz.supabase.co/storage/v1/object/public/attachments/foto-rahasia.png",
        logbook_entry: { user_id: 10 }
      });

      // Simulasi Supabase sukses membuat URL
      mockSupabase.storage.createSignedUrl.mockResolvedValue({
        data: { signedUrl: "https://url-rahasia-dari-supabase.com" },
        error: null
      });

      await viewAttachment(req, res);

      expect(mockSupabase.storage.from).toHaveBeenCalledWith("attachments");
      expect(mockSupabase.storage.createSignedUrl).toHaveBeenCalledWith("foto-rahasia.png", 3600);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        url: "https://url-rahasia-dari-supabase.com"
      });
    });

    it("Harus mereturn 500 jika Supabase gagal membuat Signed URL", async () => {
      req.params.id = "1";
      req.user = { id: 10, role: "user" };

      mockPrismaClient.attachment.findUnique.mockResolvedValue({
        id: 1,
        file_path: "https://.../error-foto.png",
        logbook_entry: { user_id: 10 }
      });

      // Simulasi Supabase ERROR!
      mockSupabase.storage.createSignedUrl.mockResolvedValue({
        data: null,
        error: new Error("Supabase Down!")
      });

      await viewAttachment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "INTERNAL_SERVER_ERROR",
        message: "Gagal mengambil file dari penyimpanan"
      });
    });
  });

  describe("deleteSupabaseAttachments() (Helper)", () => {
    
    it("Harus memanggil supabase.remove dengan nama file yang benar", async () => {
      const mockAttachments = [
        { id: 1, file_path: "url/ke/file_satu.png" },
        { id: 2, file_path: "url/ke/file_dua.pdf" },
      ];

      mockSupabase.storage.remove.mockResolvedValue({ data: "Success", error: null });

      await deleteSupabaseAttachments(mockAttachments);

      expect(mockSupabase.storage.from).toHaveBeenCalledWith("attachments");
      expect(mockSupabase.storage.remove).toHaveBeenCalledWith(["file_satu.png", "file_dua.pdf"]);
    });

    it("Tidak boleh memanggil supabase.remove jika array kosong", async () => {
      await deleteSupabaseAttachments([]);

      // Pastikan fungsi Supabase tidak pernah tersentuh
      expect(mockSupabase.storage.remove).not.toHaveBeenCalled();
    });
  });

});