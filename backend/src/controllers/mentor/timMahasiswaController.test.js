const { handleMentorshipDecision, getMyTeam } = require("./timMahasiswaController"); // Sesuaikan path jika namanya berbeda
const { updateMentorshipStatus, getMentorActiveTeam, getMentorshipById } = require("../../models/mentorshipModel");
const { PrismaClient } = require("@prisma/client");

// 1. MOCKING MODEL
jest.mock("../../models/mentorshipModel");

// 2. MOCKING PRISMA (Khusus untuk count logbook)
jest.mock("@prisma/client", () => {
  const mockPrisma = {
    logbookEntry: {
      count: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

const prisma = new PrismaClient(); // Ini akan menjadi Prisma palsu kita

describe("Tim Mahasiswa Controller Unit Tests", () => {
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
      user: { id: 1 }, // ID Mentor
      params: {},
      body: {},
      path: "", // Untuk mengecek URL /accepted atau /rejected
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // ==========================================
  // TES: handleMentorshipDecision
  // ==========================================
  describe("handleMentorshipDecision", () => {
    it("harus error 404 jika pengajuan tidak ditemukan", async () => {
      req.params.requestId = "101";
      getMentorshipById.mockResolvedValue(null); // Pura-puranya data tidak ada

      await handleMentorshipDecision(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: "NOT_FOUND" }));
    });

    it("harus error 409 jika status pengajuan sudah tidak pending (Anti-Spam)", async () => {
      req.params.requestId = "101";
      // Pura-puranya statusnya sudah 'accepted'
      getMentorshipById.mockResolvedValue({ id: 101, status: "accepted" }); 

      await handleMentorshipDecision(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: "CONFLICT" }));
    });

    it("harus error 400 jika URL path tidak valid (bukan accepted/rejected)", async () => {
      req.params.requestId = "101";
      req.path = "/api/mentor/decision/random-url"; // Path ngawur
      getMentorshipById.mockResolvedValue({ id: 101, status: "pending" });

      await handleMentorshipDecision(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: "BAD_REQUEST" }));
    });

    it("harus sukses 200 saat Menerima (Accepted) pengajuan", async () => {
      req.params.requestId = "101";
      req.body.information = "Selamat bergabung";
      req.path = "/api/mentor/decision/accepted"; // Path accepted
      
      getMentorshipById.mockResolvedValue({ id: 101, status: "pending" });
      updateMentorshipStatus.mockResolvedValue({ id: 101, status: "accepted" });

      await handleMentorshipDecision(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: "success" }));
      expect(updateMentorshipStatus).toHaveBeenCalledWith("101", "accepted", "Selamat bergabung");
    });

    it("harus sukses 200 saat Menolak (Rejected) pengajuan", async () => {
      req.params.requestId = "101";
      req.body.information = "Mohon maaf";
      req.path = "/api/mentor/decision/rejected"; // Path rejected
      
      getMentorshipById.mockResolvedValue({ id: 101, status: "pending" });
      updateMentorshipStatus.mockResolvedValue({ id: 101, status: "rejected" });

      await handleMentorshipDecision(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(updateMentorshipStatus).toHaveBeenCalledWith("101", "rejected", "Mohon maaf");
    });

    it("harus error 500 jika terjadi server error", async () => {
      req.params.requestId = "101";
      getMentorshipById.mockRejectedValue(new Error("Database rusak"));

      await handleMentorshipDecision(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ==========================================
  // TES: getMyTeam
  // ==========================================
  describe("getMyTeam", () => {
    it("harus sukses 200 dan mengembalikan array kosong jika belum punya tim", async () => {
      getMentorActiveTeam.mockResolvedValue([]); // Tidak ada tim

      await getMyTeam(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: [] }));
    });

    it("harus sukses 200 dan mengembalikan data tim beserta jumlah logbook-nya", async () => {
      const mockTeam = [
        {
          id: 1,
          status: "accepted",
          information: "Oke",
          updated_at: "2026-01-01",
          user: { id: 99, name: "Budi", email: "budi@gmail.com" },
        }
      ];
      
      getMentorActiveTeam.mockResolvedValue(mockTeam);

      // Kita atur agar waktu fungsi count dipanggil:
      // Panggilan pertama (total logbook) mengembalikan 5
      // Panggilan kedua (logbook draft) mengembalikan 2
      prisma.logbookEntry.count
        .mockResolvedValueOnce(5) 
        .mockResolvedValueOnce(2);

      await getMyTeam(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: "success" }));
      
      // Kita cek apakah data kembaliannya sesuai dengan hasil perhitungan Prisma palsu kita
      const responseData = res.json.mock.calls[0][0].data;
      expect(responseData[0].totalEntries).toBe(5);
      expect(responseData[0].waitingReview).toBe(2);
      expect(responseData[0].studentName).toBe("Budi");
    });

    it("harus error 500 jika terjadi server error", async () => {
      getMentorActiveTeam.mockRejectedValue(new Error("Gagal mengambil data"));

      await getMyTeam(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});