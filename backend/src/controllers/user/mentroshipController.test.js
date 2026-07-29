const { requestMentorship, getMentorsList, getMentorshipHistory } = require("./mentorshipController"); // Sesuaikan path jika berbeda
const { findMentors } = require("../../models/userModel");
const {
  createMentorship,
  checkExistingRequest,
  getMyRequestedMentors,
  getMentorRequestsHistory,
  checkAcceptedMentorship,
} = require("../../models/mentorshipModel");

jest.mock("../../models/notificationModel", () => ({
  createNotificationData: jest.fn().mockResolvedValue({ id: 1, message: "Notif sukses" }),
}));

// 1. MOCKING MODELS
jest.mock("../../models/userModel");
jest.mock("../../models/mentorshipModel");

describe("Mentorship Controller Unit Tests", () => {
  // Membungkam console.error agar terminal tetap bersih
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  let req, res;

  beforeEach(() => {
    jest.clearAllMocks(); // Bersihkan ingatan mock setiap mulai tes baru

    req = {
      user: { id: 1, role: "user" }, // Default role user
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // ==========================================
  // TES: requestMentorship
  // ==========================================
  describe("requestMentorship", () => {
    it("harus error 403 jika user sudah punya mentor aktif", async () => {
      req.params.id = "2";
      checkAcceptedMentorship.mockResolvedValue(true); // Pura-puranya sudah punya mentor

      await requestMentorship(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: "FORBIDDEN" }));
    });

    it("harus error 409 jika status pengajuan masih pending", async () => {
      req.params.id = "2";
      checkAcceptedMentorship.mockResolvedValue(false);
      checkExistingRequest.mockResolvedValue({ status: "pending" });

      await requestMentorship(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: "Kamu sudah mengajukan request ke mentor ini dan masih menunggu persetujuan."
      }));
    });

    it("harus error 409 jika status pengajuan sudah accepted", async () => {
      req.params.id = "2";
      checkAcceptedMentorship.mockResolvedValue(false);
      checkExistingRequest.mockResolvedValue({ status: "accepted" });

      await requestMentorship(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
    });

    it("harus error 409 jika status pengajuan sudah rejected", async () => {
      req.params.id = "2";
      checkAcceptedMentorship.mockResolvedValue(false);
      checkExistingRequest.mockResolvedValue({ status: "rejected" });

      await requestMentorship(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
    });

    it("harus sukses 200 dan mengirim request baru jika belum pernah request", async () => {
      req.params.id = "2";
      checkAcceptedMentorship.mockResolvedValue(false);
      checkExistingRequest.mockResolvedValue(null); // Belum pernah request
      createMentorship.mockResolvedValue({ id: 10, userId: 1, mentorId: 2, status: "pending" });

      await requestMentorship(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: "success" }));
    });

    it("harus error 409 jika terjadi duplikasi dari Prisma (Error P2002)", async () => {
      req.params.id = "2";
      checkAcceptedMentorship.mockResolvedValue(false);
      checkExistingRequest.mockResolvedValue(null);
      
      // Simulasi Prisma menghasilkan error P2002 (Unique Constraint Failed)
      const prismaError = new Error("Unique Constraint Failed");
      prismaError.code = "P2002";
      createMentorship.mockRejectedValue(prismaError);

      await requestMentorship(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: "Anda sudah pernah mengajukan request bimbingan ke mentor ini sebelumnya."
      }));
    });

    it("harus error 500 jika terjadi server error secara umum", async () => {
      req.params.id = "2";
      checkAcceptedMentorship.mockRejectedValue(new Error("Server Down"));

      await requestMentorship(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ==========================================
  // TES: getMentorsList
  // ==========================================
  describe("getMentorsList", () => {
    it("harus sukses 200 dan HANYA mengembalikan mentor aktif jika sudah punya", async () => {
      const mockActiveMentor = { mentor: { id: 2, name: "Mentor Budi" } };
      checkAcceptedMentorship.mockResolvedValue(mockActiveMentor);

      await getMentorsList(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        data: [{ id: 2, name: "Mentor Budi" }] // Terbungkus dalam array sesuai kodemu
      }));
    });

    it("harus sukses 200 dan mengembalikan semua daftar mentor jika belum punya mentor", async () => {
      checkAcceptedMentorship.mockResolvedValue(null); // Belum punya mentor
      findMentors.mockResolvedValue([{ id: 2 }, { id: 3 }]);

      await getMentorsList(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        data: [{ id: 2 }, { id: 3 }]
      }));
    });

    it("harus error 500 jika terjadi server error", async () => {
      checkAcceptedMentorship.mockRejectedValue(new Error("Server rusak"));

      await getMentorsList(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ==========================================
  // TES: getMentorshipHistory
  // ==========================================
  describe("getMentorshipHistory", () => {
    it("harus sukses 200 dan memformat data untuk role 'user'", async () => {
      req.user.role = "user";
      const mockHistory = [
        {
          id: 1, status: "pending", information: "Halo", created_at: "2026-01-01", updated_at: "2026-01-02",
          mentor: { id: 2, name: "Budi" } // Struktur relasi model
        }
      ];
      getMyRequestedMentors.mockResolvedValue(mockHistory);

      await getMentorshipHistory(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        role: "user",
      }));
      // Cek apakah data diformat dengan benar (mentorName ada)
      const responseData = res.json.mock.calls[0][0].data;
      expect(responseData[0].mentorName).toBe("Budi");
    });

    it("harus sukses 200 dan memformat data untuk role 'mentor'", async () => {
      req.user.role = "mentor";
      const mockQueue = [
        {
          id: 1, status: "pending", information: "Halo", created_at: "2026-01-01", updated_at: "2026-01-02",
          user: { id: 5, name: "Mahasiswa A" } // Struktur relasi model
        }
      ];
      getMentorRequestsHistory.mockResolvedValue(mockQueue);

      await getMentorshipHistory(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        role: "mentor",
      }));
      // Cek apakah data diformat dengan benar (studentName ada)
      const responseData = res.json.mock.calls[0][0].data;
      expect(responseData[0].studentName).toBe("Mahasiswa A");
    });

    it("harus error 403 jika role tidak valid", async () => {
      req.user.role = "admin_penyusup"; // Role selain user/mentor

      await getMentorshipHistory(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: "FORBIDDEN"
      }));
    });

    it("harus error 500 jika terjadi server error", async () => {
      req.user.role = "user";
      getMyRequestedMentors.mockRejectedValue(new Error("Gagal mengambil riwayat"));

      await getMentorshipHistory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});