const {
  getMyLogbook,
  createLogbook,
  getLogbook,
  updateLogbook,
  deleteLogbook,
  submitLogbook,
} = require("./logbookController"); // Sesuaikan path jika berbeda
const fs = require("fs");
const {
  getLogbookById,
  createLogbookEntry,
  getLogbookDetail,
  updateLogbookEntry,
  deleteLogbookEntry,
  getLogbookByIdAndUser,
  updateLogbookStatusToSubmitted,
} = require("../../models/logbookModel");
const { checkAcceptedMentorship } = require("../../models/mentorshipModel");

jest.mock("../../models/mentorshipModel", () => ({
  checkAcceptedMentorship: jest.fn(),
}));

jest.mock("../../models/notificationModel", () => ({
  createNotificationData: jest.fn().mockResolvedValue({ id: 1, message: "Notif sukses" }),
}));

jest.mock("@prisma/client", () => {
  return { PrismaClient: jest.fn() };
});

// 1. MOCKING: Memalsukan model dan module fs (agar tidak menghapus file beneran)
jest.mock("../../models/logbookModel");
jest.mock("fs");

describe("Logbook Controller Unit Tests", () => {
  let req, res;

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  
  afterAll(() => {
    console.error.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks(); // Bersihkan ingatan mock setiap mulai tes baru

    // Membuat kerangka Request (req) dan Response (res) palsu
    req = {
      user: { id: 1 }, // Asumsi user yang sedang login punya ID 1
      body: {},
      params: {},
      file: undefined,
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // ==========================================
  // TES: getMyLogbook
  // ==========================================
  describe("getMyLogbook", () => {
    it("harus error 404 jika logbook tidak ditemukan", async () => {
      getLogbookById.mockResolvedValue(null);

      await getMyLogbook(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });

    it("harus sukses 200 dan mengembalikan data logbook", async () => {
      const mockData = [{ id: 1, title: "Logbook 1" }];
      getLogbookById.mockResolvedValue(mockData);

      await getMyLogbook(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, data: mockData }));
    });

    it("harus error 500 jika terjadi server error", async () => {
      getLogbookById.mockRejectedValue(new Error("Database error"));

      await getMyLogbook(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ==========================================
  // TES: createLogbook
  // ==========================================
  describe("createLogbook", () => {
    it("harus error 400 jika field wajib tidak diisi", async () => {
      req.body = { title: "Test" }; // Sengaja activity_date dan description kosong

      await createLogbook(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Semua field harus diisi." }));
    });

    it("harus sukses 201 membuat logbook TANPA file attachment", async () => {
      req.body = { activity_date: "2026-01-01", title: "Test", description: "Desc" };
      const mockCreated = { id: 1, title: "Test" };
      createLogbookEntry.mockResolvedValue(mockCreated);

      await createLogbook(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(createLogbookEntry).toHaveBeenCalledWith(expect.objectContaining({
        attachments: null
      }));
    });

    it("harus sukses 201 membuat logbook DENGAN file attachment", async () => {
      req.body = { activity_date: "2026-01-01", title: "Test", description: "Desc" };
      req.file = { originalname: "file.jpg", filename: "12345-file.jpg" }; // Simulasi upload file
      
      createLogbookEntry.mockResolvedValue({ id: 1 });

      await createLogbook(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(createLogbookEntry).toHaveBeenCalledWith(expect.objectContaining({
        attachments: expect.any(Object)
      }));
    });
  });

  // ==========================================
  // TES: getLogbook (Detail)
  // ==========================================
  describe("getLogbook (Detail)", () => {
    it("harus error 400 jika ID tidak valid (bukan angka)", async () => {
      req.params.id = "abc"; // ID Invalid

      await getLogbook(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("harus error 404 jika logbook tidak ditemukan", async () => {
      req.params.id = "1";
      getLogbookDetail.mockResolvedValue(null);

      await getLogbook(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("harus sukses 200 dan mengembalikan detail logbook", async () => {
      req.params.id = "1";
      getLogbookDetail.mockResolvedValue({ id: 1, title: "Detail" });

      await getLogbook(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  // ==========================================
  // TES: updateLogbook
  // ==========================================
  describe("updateLogbook", () => {
    it("harus error 404 jika logbook yang mau diupdate tidak ada", async () => {
      req.params.id = "1";
      getLogbookDetail.mockResolvedValue(null);

      await updateLogbook(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("harus sukses 200 mengupdate data dan mengganti file lama", async () => {
      req.params.id = "1";
      req.body = { title: "Updated Title" };
      req.file = { originalname: "new.jpg", filename: "123-new.jpg" };

      // Simulasi logbook lama punya attachment
      getLogbookDetail.mockResolvedValue({
        id: 1,
        attachments: [{ file_path: "/uploads/old.jpg" }]
      });

      fs.existsSync.mockReturnValue(true); // Pura-pura file lama ada di folder
      fs.unlinkSync.mockReturnValue(); // Pura-pura berhasil hapus file
      updateLogbookEntry.mockResolvedValue({ id: 1, title: "Updated Title" });

      await updateLogbook(req, res);

      expect(fs.unlinkSync).toHaveBeenCalled(); // Pastikan fungsi hapus file dipanggil
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  // ==========================================
  // TES: deleteLogbook
  // ==========================================
  describe("deleteLogbook", () => {
    it("harus error 404 jika logbook yang mau dihapus tidak ada", async () => {
      req.params.id = "1";
      getLogbookDetail.mockResolvedValue(null);

      await deleteLogbook(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("harus sukses 200 menghapus logbook beserta filenya", async () => {
      req.params.id = "1";
      getLogbookDetail.mockResolvedValue({
        id: 1,
        attachments: [{ file_path: "/uploads/hapus.jpg" }]
      });

      fs.existsSync.mockReturnValue(true);
      deleteLogbookEntry.mockResolvedValue(true);

      await deleteLogbook(req, res);

      expect(fs.unlinkSync).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });


  // TES: submitLogbook

  describe("submitLogbook", () => {
    it("harus error 404 jika logbook tidak ditemukan", async () => {
      req.params.id = "1";
      getLogbookByIdAndUser.mockResolvedValue(null);

      await submitLogbook(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("harus error 400 jika status logbook bukan draft", async () => {
      req.params.id = "1";
      getLogbookByIdAndUser.mockResolvedValue({ id: 1, status: "submitted" }); // Status salah

      await submitLogbook(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Logbook sudah tidak dalam status draft." }));
    });

    it("harus error 400 jika title atau deskripsi kosong saat di-submit", async () => {
      req.params.id = "1";
      // Logbook status draft tapi isinya kosong
      getLogbookByIdAndUser.mockResolvedValue({ id: 1, status: "draft", title: null }); 

      await submitLogbook(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: "VALIDATION_ERROR" }));
    });

    it("harus sukses 200 jika syarat terpenuhi dan berhasil di-submit", async () => {
      req.params.id = "1";
      getLogbookByIdAndUser.mockResolvedValue({ id: 1, status: "draft", title: "Ada", description: "Ada" });
      updateLogbookStatusToSubmitted.mockResolvedValue({ id: 1, status: "submitted" });

      await submitLogbook(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: "Logbook berhasil disubmit dan menunggu evaluasi mentor."
      }));
    });
  });
});