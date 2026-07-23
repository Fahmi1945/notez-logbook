const verifyToken = require("./verifyToken");
const jwt = require("jsonwebtoken");

// Tirukan (mock) library jsonwebtoken agar pengujian terisolasi
jest.mock("jsonwebtoken");

describe("Middleware: verifyToken", () => {
  let mockReq;
  let mockRes;
  let mockNext;

  // Set environment variable untuk JWT Secret
  process.env.JWT_SECRET = "rahasia_testing_123";

  beforeEach(() => {
    // Siapkan objek req, res, dan next yang segar setiap kali tes dijalankan
    mockReq = {
      headers: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();

    // Bersihkan riwayat panggilan mock dari tes sebelumnya
    jest.clearAllMocks();
  });

  // --- SKENARIO 1: HEADER AUTHORIZATION KOSONG ---
  it("harus menolak akses (401) jika header authorization tidak ada", () => {
    verifyToken(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "UNAUTHORIZED",
      message: "Akses ditolak",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  // --- SKENARIO 2: FORMAT HEADER SALAH (TIDAK DIAWALI 'Bearer ') ---
  it("harus menolak akses (401) jika format header tidak diawali 'Bearer '", () => {
    mockReq.headers.authorization = "Basic token_12345";

    verifyToken(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "UNAUTHORIZED",
      message: "Akses ditolak",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  // --- SKENARIO 3: TOKEN TIDAK VALID / KADALUARSA ---
  it("harus menolak akses (401) jika token tidak valid atau kadaluarsa", () => {
    mockReq.headers.authorization = "Bearer token_salah";
    
    // Simulasi jwt.verify melempar error (catch)
    jwt.verify.mockImplementation(() => {
      throw new Error("jwt expired");
    });

    verifyToken(mockReq, mockRes, mockNext);

    expect(jwt.verify).toHaveBeenCalledWith("token_salah", process.env.JWT_SECRET);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "INVALID_TOKEN",
      message: "Session telah habis, silahkan login kembali",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  // --- SKENARIO 4: TOKEN VALID (BERHASIL) ---
  it("harus menyimpan data decoded ke req.user dan memanggil next() jika token valid", () => {
    const mockDecodedUser = { id: 1, username: "user_test", role: "admin" };
    mockReq.headers.authorization = "Bearer token_asli_valid";
    
    // Simulasi jwt.verify mengembalikan data decoded
    jwt.verify.mockReturnValue(mockDecodedUser);

    verifyToken(mockReq, mockRes, mockNext);

    expect(jwt.verify).toHaveBeenCalledWith("token_asli_valid", process.env.JWT_SECRET);
    expect(mockReq.user).toEqual(mockDecodedUser);
    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockRes.status).not.toHaveBeenCalled();
  });
});