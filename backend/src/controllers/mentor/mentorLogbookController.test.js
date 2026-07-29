const { getMenteeLogbooks, evaluatedDataLogbook } = require("./mentorLogbookController"); // Sesuaikan path jika berbeda
const {
  getActiveMenteeIds,
  getLogbooksByMenteeIds,
  countLogbooksByMenteeIds,
  checkIsMyMentee,
  evaluateLogbook,
  getLogbookById,
} = require("../../models/mentorLogbookModel");
const { createNotificationData } = require("../../models/notificationModel");

jest.mock("../../models/notificationModel", () => ({
  createNotificationData: jest.fn().mockResolvedValue({ id: 1, message: "Notif sukses" }),
}));

// 1. MOCKING UTAMA: Cegah Prisma crash dan palsukan model
jest.mock("@prisma/client", () => {
  return { PrismaClient: jest.fn() };
});
jest.mock("../../models/mentorLogbookModel");

describe("Mentor Logbook Controller Unit Tests", () => {
  
  // Membungkam console.error agar terminal tetap bersih saat simulasi error
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  let req, res;

  beforeEach(() => {
    jest.clearAllMocks(); // Bersihkan memori mock tiap mulai tes baru

    req = {
      user: { id: 1 }, // Asumsi mentor yang login punya ID 1
      query: {},
      params: {},
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // ==========================================
  // TES: getMenteeLogbooks
  // ==========================================
  describe("getMenteeLogbooks", () => {
    it("harus sukses 200 dan mengembalikan array kosong jika belum ada menti", async () => {
      // Skenario: Mentor tidak punya menti aktif
      getActiveMenteeIds.mockResolvedValue([]);

      await getMenteeLogbooks(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        status: "success",
        message: "Belum ada logbook dari menti Anda.",
        data: [],
      }));
    });

    it("harus sukses 200 dan mengembalikan data logbook dengan pagination yang benar", async () => {
      // Skenario: Mentor punya menti, minta halaman 1 limit 10
      req.query = { page: "1", limit: "10" };
      
      getActiveMenteeIds.mockResolvedValue([2, 3]); // ID Menti: 2 dan 3
      getLogbooksByMenteeIds.mockResolvedValue([{ id: 101, title: "Logbook Menti" }]);
      countLogbooksByMenteeIds.mockResolvedValue(1); // Total data ada 1

      await getMenteeLogbooks(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        status: "success",
        data: expect.any(Array),
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        }
      }));
      // Pastikan Model dipanggil dengan argumen skip dan take yang benar (skip 0, take 10)
      expect(getLogbooksByMenteeIds).toHaveBeenCalledWith([2, 3], 0, 10);
    });

    it("harus error 500 jika terjadi server error", async () => {
      getActiveMenteeIds.mockRejectedValue(new Error("Database putus"));

      await getMenteeLogbooks(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: "SERVER_ERROR",
      }));
    });
  });

  // ==========================================
  // TES: evaluatedDataLogbook
  // ==========================================
  describe("evaluatedDataLogbook", () => {
    it("harus error 400 jika status penilaian tidak valid", async () => {
      req.params.id = "101";
      req.body = { status: "ngawur" }; // Status selain approved/rejected

      await evaluatedDataLogbook(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: "INVALID_STATUS",
      }));
    });

    it("harus error 400 jika logbook ditolak (rejected) tapi tidak ada feedback", async () => {
      req.params.id = "101";
      req.body = { status: "rejected", feedback: "   " }; // Feedback hanya spasi kosong

      await evaluatedDataLogbook(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: "INVALID_FEEDBACK",
      }));
    });

    it("harus error 404 jika logbook tidak ditemukan di database", async () => {
      req.params.id = "101";
      req.body = { status: "approved" };
      
      getLogbookById.mockResolvedValue(null);

      await evaluatedDataLogbook(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: "LOGBOOK_NOT_FOUND",
      }));
    });

    it("harus error 400 jika logbook belum disubmit (masih draft)", async () => {
      req.params.id = "101";
      req.body = { status: "approved" };
      
      getLogbookById.mockResolvedValue({ id: 101, status: "draft", user_id: 2 });

      await evaluatedDataLogbook(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: "Logbook tidak dapat dinilai karena belum disubmit",
      }));
    });

    it("harus error 403 (Forbidden) jika logbook milik menti dari mentor lain", async () => {
      req.params.id = "101";
      req.body = { status: "approved" };
      
      getLogbookById.mockResolvedValue({ id: 101, status: "submitted", user_id: 99 });
      checkIsMyMentee.mockResolvedValue(false); // Pura-puranya ini BUKAN menti dia

      await evaluatedDataLogbook(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: "FORBIDDEN",
      }));
    });

    it("harus sukses 200 menilai logbook (Approved) dengan feedback default", async () => {
      req.params.id = "101";
      req.body = { status: "approved" }; // Tidak kirim feedback
      
      getLogbookById.mockResolvedValue({ id: 101, status: "submitted", user_id: 2 });
      checkIsMyMentee.mockResolvedValue(true);
      evaluateLogbook.mockResolvedValue({ id: 101, status: "approved", comment: "Logbook disetujui" });

      await evaluatedDataLogbook(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        status: "success",
      }));
      // Pastikan fungsi dipanggil dengan finalComment "Logbook disetujui"
      expect(evaluateLogbook).toHaveBeenCalledWith("101", 1, "approved", "Logbook disetujui");
    });

    it("harus sukses 200 menilai logbook (Rejected) dengan feedback manual", async () => {
      req.params.id = "101";
      req.body = { status: "rejected", feedback: "Tolong perbaiki bagian analisis" }; 
      
      getLogbookById.mockResolvedValue({ id: 101, status: "submitted", user_id: 2 });
      checkIsMyMentee.mockResolvedValue(true);
      evaluateLogbook.mockResolvedValue({ id: 101, status: "rejected" });

      await evaluatedDataLogbook(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(evaluateLogbook).toHaveBeenCalledWith("101", 1, "rejected", "Tolong perbaiki bagian analisis");
    });

    it("harus error 500 jika terjadi server error saat evaluasi", async () => {
      req.params.id = "101";
      req.body = { status: "approved" };
      
      getLogbookById.mockRejectedValue(new Error("Koneksi terputus"));

      await evaluatedDataLogbook(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});