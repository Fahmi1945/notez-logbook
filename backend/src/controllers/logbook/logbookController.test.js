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

// Mock dependencies
jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn(),
}));
jest.mock("../../models/logbookModel");
jest.mock("fs");

describe("Logbook Controller Unit Tests", () => {
  let req, res;

  beforeAll(() => {
    // Menyembunyikan output console.error agar log terminal tetap bersih saat testing error
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  beforeEach(() => {
    jest.resetAllMocks(); // Mengembalikan semua mock return value ke state bersih

    // Kerangka Request & Response Express
    req = {
      user: { id: 1 },
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
    it("harus error 500 jika terjadi server error", async () => {
      getLogbookById.mockRejectedValue(new Error("Database error"));

      await getMyLogbook(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "INTERNAL_SERVER_ERROR",
        })
      );
    });
  });

  // ==========================================
  // TES: createLogbook
  // ==========================================
  describe("createLogbook", () => {
    it("harus sukses 201 membuat logbook TANPA file attachment", async () => {
      req.body = {
        activity_date: "2026-01-01",
        title: "Test",
        description: "Desc",
      };
      const mockCreated = { id: 1, title: "Test" };
      createLogbookEntry.mockResolvedValue(mockCreated);

      await createLogbook(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(createLogbookEntry).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Test",
          description: "Desc",
          user: { connect: { id: 1 } },
        })
      );
    });
  });

  // ==========================================
  // TES: getLogbook (Detail)
  // ==========================================
  describe("getLogbook (Detail)", () => {
    it("harus error 400 jika ID tidak valid (bukan angka)", async () => {
      req.params.id = "abc";

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
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
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

      getLogbookDetail.mockResolvedValue({
        id: 1,
        attachments: [{ file_path: "/uploads/old.jpg" }],
      });

      fs.existsSync.mockReturnValue(true);
      fs.unlinkSync.mockImplementation(() => {});
      updateLogbookEntry.mockResolvedValue({ id: 1, title: "Updated Title" });

      await updateLogbook(req, res);

      expect(fs.existsSync).toHaveBeenCalled();
      expect(fs.unlinkSync).toHaveBeenCalled();
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
        attachments: [{ file_path: "/uploads/hapus.jpg" }],
      });

      fs.existsSync.mockReturnValue(true);
      fs.unlinkSync.mockImplementation(() => {});
      deleteLogbookEntry.mockResolvedValue(true);

      await deleteLogbook(req, res);

      expect(fs.unlinkSync).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  // ==========================================
  // TES: submitLogbook
  // ==========================================
  describe("submitLogbook", () => {
    it("harus error 404 jika logbook tidak ditemukan", async () => {
      req.params.id = "1";
      getLogbookByIdAndUser.mockResolvedValue(null);

      await submitLogbook(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("harus error 400 jika status logbook bukan draft", async () => {
      req.params.id = "1";
      getLogbookByIdAndUser.mockResolvedValue({ id: 1, status: "submitted" });

      await submitLogbook(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Logbook sudah tidak dalam status draft.",
        })
      );
    });

    it("harus error 400 jika title atau deskripsi kosong saat di-submit", async () => {
      req.params.id = "1";
      getLogbookByIdAndUser.mockResolvedValue({
        id: 1,
        status: "draft",
        title: null,
      });

      await submitLogbook(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: "VALIDATION_ERROR" })
      );
    });

    it("harus sukses 200 jika syarat terpenuhi dan berhasil di-submit", async () => {
      req.params.id = "1";
      getLogbookByIdAndUser.mockResolvedValue({
        id: 1,
        status: "draft",
        title: "Ada",
        description: "Ada",
      });
      updateLogbookStatusToSubmitted.mockResolvedValue({
        id: 1,
        status: "submitted",
      });

      await submitLogbook(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Logbook berhasil disubmit dan menunggu evaluasi mentor.",
        })
      );
    });
  });
});
