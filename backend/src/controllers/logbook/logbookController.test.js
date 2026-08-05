// 1. MOCK DEPENDENCIES
const mockUpload = jest.fn();
const { Buffer } = require("buffer");

jest.mock("../../config/supabase", () => ({
  storage: {
    from: jest.fn(() => ({
      upload: mockUpload,
    })),
  },
}));
jest.mock("../../services/pdfServices", () => {
  return {
    // CUKUP GUNAKAN STRING BIASA, HAPUS Buffer.from()
    generateLogbookPDF: jest.fn().mockResolvedValue("PDF_PALSU"),
  };
});
jest.mock("../../models/logbookModel");
jest.mock("../attachment/attachmentController");
jest.mock("../../models/notificationModel");
jest.mock("../../models/mentorshipModel");


const {
  getMyLogbook,
  createLogbook,
  getLogbook,
  updateLogbook,
  deleteLogbook,
  submitLogbook,
} = require("./logbookController");

const {
  getLogbookById,
  createLogbookEntry,
  getLogbookDetail,
  updateLogbookEntry,
  deleteLogbookEntry,
  getLogbookByIdAndUser,
  updateLogbookStatusToSubmitted,
} = require("../../models/logbookModel");

// TAMBAHAN IMPORT UNTUK MOCK SUBMIT LOGBOOK
const { createNotificationData } = require("../../models/notificationModel");
const { checkAcceptedMentorship } = require("../../models/mentorshipModel");

const { deleteSupabaseAttachments } = require("../attachment/attachmentController");
const supabase = require("../../config/supabase");


describe("Logbook Controller Unit Tests", () => {
  let req, res;

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => { });
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();

    mockUpload.mockResolvedValue({ data: {}, error: null });

    req = {
      // Tambahkan nama untuk mencegah undefined saat submitLogbook
      user: { id: 1, name: "Budi Mahasiswa" },
      body: {},
      params: {},
      file: undefined,
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  // ==========================================
  // TES: getMyLogbook
  // ==========================================
  describe("getMyLogbook", () => {
    it("harus error 404 jika logbook tidak ditemukan", async () => {
      getLogbookById.mockResolvedValue(null);

      await getMyLogbook(req, res);

      expect(getLogbookById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Logbook tidak ditemukan.",
      });
    });

    it("harus sukses 200 dan mengembalikan data logbook", async () => {
      const mockLogbook = [{ id: 10, title: "Hari Pertama Intern" }];
      getLogbookById.mockResolvedValue(mockLogbook);

      await getMyLogbook(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Logbook berhasil diambil.",
        data: mockLogbook,
      });
    });

    it("harus error 500 jika terjadi kesalahan server/database", async () => {
      getLogbookById.mockRejectedValue(new Error("Database connection fail"));

      await getMyLogbook(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "INTERNAL_SERVER_ERROR",
        message: "Terjadi kesalahan saat mengambil logbook.",
      });
    });
  });

  // ==========================================
  // TES: createLogbook
  // ==========================================
  describe("createLogbook", () => {
    it("harus error 400 jika field wajib tidak lengkap", async () => {
      req.body = { title: "Hanya Judul" };

      await createLogbook(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Semua field harus diisi.",
      });
    });

    it("harus sukses 201 membuat logbook TANPA file attachment", async () => {
      req.body = {
        activity_date: "2026-01-01", // PERUBAHAN: Gunakan tanggal di masa lalu agar lolos validasi
        title: "Setup Project",
        description: "Melakukan setup repository",
        obstacles: "Koneksi lambat",
      };

      const mockCreated = { id: 100, ...req.body };
      createLogbookEntry.mockResolvedValue(mockCreated);

      await createLogbook(req, res);

      expect(createLogbookEntry).toHaveBeenCalledWith({
        activity_date: expect.any(Date),
        title: "Setup Project",
        description: "Melakukan setup repository",
        obstacles: "Koneksi lambat",
        user: { connect: { id: 1 } },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Logbook berhasil dibuat.",
        data: mockCreated,
      });
    });

    it("harus sukses 201 membuat logbook DENGAN file attachment ke Supabase", async () => {
      req.body = {
        activity_date: "2026-01-01", // PERUBAHAN: Gunakan tanggal di masa lalu
        title: "Setup Project",
        description: "Melakukan setup repository",
      };
      req.file = {
        originalname: "laporan harian.pdf",
        buffer: Buffer.from("dummy-pdf"),
        mimetype: "application/pdf",
      };

      mockUpload.mockResolvedValue({ data: { path: "some-path" }, error: null });
      createLogbookEntry.mockResolvedValue({ id: 101, title: "Setup Project" });

      await createLogbook(req, res);

      expect(supabase.storage.from).toHaveBeenCalledWith("attachments");
      expect(createLogbookEntry).toHaveBeenCalledWith(
        expect.objectContaining({
          attachments: {
            create: [
              {
                file_name: "laporan harian.pdf",
                file_path: expect.stringMatching(/laporan-harian\.pdf$/),
              },
            ],
          },
        })
      );
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("harus error 500 jika upload file ke Supabase gagal", async () => {
      req.body = {
        activity_date: "2026-01-01", // PERUBAHAN: Gunakan tanggal di masa lalu
        title: "Setup Project",
        description: "Melakukan setup",
      };
      req.file = {
        originalname: "bukti.jpg",
        buffer: Buffer.from("img"),
        mimetype: "image/jpeg",
      };

      mockUpload.mockResolvedValue({
        data: null,
        error: { message: "Storage bucket fail" },
      });

      await createLogbook(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Gagal mengunggah file attachment ke server penyimpanan.",
      });
    });
  });

  // ==========================================
  // TES: getLogbook (Detail)
  // ==========================================
  describe("getLogbook", () => {
    it("harus error 400 jika ID logbook bukan angka", async () => {
      req.params.id = "invalid-id";

      await getLogbook(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "ID Logbook tidak valid.",
      });
    });

    it("harus error 404 jika logbook tidak ditemukan", async () => {
      req.params.id = "10";
      getLogbookDetail.mockResolvedValue(null);

      await getLogbook(req, res);

      expect(getLogbookDetail).toHaveBeenCalledWith("10", 1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Logbook tidak ditemukan.",
      });
    });

    it("harus sukses 200 mengembalikan detail logbook", async () => {
      req.params.id = "10";
      const mockDetail = { id: 10, title: "Detail Logbook" };
      getLogbookDetail.mockResolvedValue(mockDetail);

      await getLogbook(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Logbook berhasil diambil.",
        data: mockDetail,
      });
    });
  });

  // ==========================================
  // TES: updateLogbook
  // ==========================================
  describe("updateLogbook", () => {
    it("harus error 404 jika logbook yang akan diupdate tidak ditemukan", async () => {
      req.params.id = "5";
      getLogbookDetail.mockResolvedValue(null);

      await updateLogbook(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Logbook tidak ditemukan.",
      });
    });

    it("harus menghapus file lama jika remove_attachment bernilai 'true'", async () => {
      req.params.id = "5";
      req.body = { remove_attachment: "true" };

      const mockExisting = {
        id: 5,
        attachments: [{ file_path: "file-lama.jpg" }],
      };
      getLogbookDetail.mockResolvedValue(mockExisting);
      deleteSupabaseAttachments.mockResolvedValue(true);
      updateLogbookEntry.mockResolvedValue({ id: 5 });

      await updateLogbook(req, res);

      expect(deleteSupabaseAttachments).toHaveBeenCalledWith(mockExisting.attachments);
      expect(updateLogbookEntry).toHaveBeenCalledWith(
        "5",
        expect.objectContaining({
          attachments: { deleteMany: {} },
        })
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("harus mengganti file lama dengan file baru jika req.file dilampirkan", async () => {
      req.params.id = "5";
      req.body = { title: "Judul Baru" };
      req.file = {
        originalname: "file baru.png",
        buffer: Buffer.from("new-img"),
        mimetype: "image/png",
      };

      const mockExisting = {
        id: 5,
        attachments: [{ file_path: "old.png" }],
      };

      getLogbookDetail.mockResolvedValue(mockExisting);
      deleteSupabaseAttachments.mockResolvedValue(true);

      mockUpload.mockResolvedValue({ data: {}, error: null });
      updateLogbookEntry.mockResolvedValue({ id: 5, title: "Judul Baru" });

      await updateLogbook(req, res);

      expect(deleteSupabaseAttachments).toHaveBeenCalledWith(mockExisting.attachments);

      expect(updateLogbookEntry).toHaveBeenCalledWith(
        "5",
        expect.objectContaining({
          title: "Judul Baru",
          attachments: {
            deleteMany: {},
            create: [
              {
                file_name: "file baru.png",
                file_path: expect.stringMatching(/file_baru\.png$/),
              },
            ],
          },
        })
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  // ==========================================
  // TES: deleteLogbook
  // ==========================================
  describe("deleteLogbook", () => {
    it("harus error 404 jika logbook yang mau dihapus tidak ada", async () => {
      req.params.id = "8";
      getLogbookDetail.mockResolvedValue(null);

      await deleteLogbook(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Logbook tidak ditemukan.",
      });
    });

    it("harus sukses 200 menghapus logbook dan menghapus attachment Supabase jika ada", async () => {
      req.params.id = "8";
      const mockExisting = {
        id: 8,
        attachments: [{ file_path: "file1.jpg" }],
      };

      getLogbookDetail.mockResolvedValue(mockExisting);
      deleteSupabaseAttachments.mockResolvedValue(true);
      deleteLogbookEntry.mockResolvedValue(true);

      await deleteLogbook(req, res);

      expect(deleteSupabaseAttachments).toHaveBeenCalledWith(mockExisting.attachments);
      expect(deleteLogbookEntry).toHaveBeenCalledWith("8");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Logbook berhasil dihapus.",
      });
    });
  });

  // ==========================================
  // TES: submitLogbook
  // ==========================================
  describe("submitLogbook", () => {
    it("harus error 404 jika logbook tidak ditemukan", async () => {
      req.params.id = "12";
      getLogbookByIdAndUser.mockResolvedValue(null);

      await submitLogbook(req, res);

      expect(getLogbookByIdAndUser).toHaveBeenCalledWith(12, 1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Logbook tidak ditemukan.",
      });
    });

    it("harus error 400 jika status logbook bukan draft", async () => {
      req.params.id = "12";
      getLogbookByIdAndUser.mockResolvedValue({ id: 12, status: "submitted" });

      await submitLogbook(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Logbook sudah tidak dalam status draft.",
      });
    });

    it("harus error 400 jika title atau description kosong", async () => {
      req.params.id = "12";
      getLogbookByIdAndUser.mockResolvedValue({
        id: 12,
        status: "draft",
        title: null,
        description: "Ada isi",
      });

      await submitLogbook(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "VALIDATION_ERROR",
        message: "Logbook tidak memiliki judul atau deskripsi.",
      });
    });

    it("harus sukses 200 jika status draft dan validasi terpenuhi", async () => {
      req.params.id = "12";
      getLogbookByIdAndUser.mockResolvedValue({
        id: 12,
        status: "draft",
        title: "Implementasi Feature",
        description: "Membuat controller",
      });
      updateLogbookStatusToSubmitted.mockResolvedValue({
        id: 12,
        status: "submitted",
      });

      // PERUBAHAN KRUSIAL: Mencegah timeout dengan melakukan Mock pada fungsi Notifikasi & Mentorship
      checkAcceptedMentorship.mockResolvedValue({ mentor_id: 99 });
      createNotificationData.mockResolvedValue(true);

      await submitLogbook(req, res);

      expect(updateLogbookStatusToSubmitted).toHaveBeenCalledWith(12);
      expect(checkAcceptedMentorship).toHaveBeenCalledWith(1); // User ID = 1
      expect(createNotificationData).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Logbook berhasil disubmit dan menunggu evaluasi mentor.",
        data: { id: 12, status: "submitted" },
      });
    });
  });

  // ==========================================
  // TES: exportLogbookToPDF
  // ==========================================

});
