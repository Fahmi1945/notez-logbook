const { getProfile, updateProfile, changePassword } = require("./profileController");
const { findUserById, updateUser } = require("../../models/userModel");
const bcrypt = require("bcrypt");

// 1. MOCKING DEPENDENCIES
// Kita perintahkan Jest untuk "memalsukan" file userModel dan bcrypt
jest.mock("../../models/userModel");
jest.mock("bcrypt");

describe("Profile Controller Tests", () => {
  // Fungsi pembantu untuk memalsukan request (req) dan response (res) Express
  let mockReq;
  let mockRes;

  beforeEach(() => {
    // Reset semua fungsi palsu sebelum setiap tes dijalankan
    jest.clearAllMocks();

    mockReq = {
      user: { id: 1 }, // Anggap user dengan ID 1 sedang login
      body: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });


  // TEST SUITE 1: GET PROFILE

  describe("getProfile", () => {
    it("✅ Berhasil mengambil profil user (Status 200)", async () => {
      // Skenario: Database berhasil menemukan user
      const fakeUser = { id: 1, name: "Raja Koding", email: "raja@mail.com" };
      findUserById.mockResolvedValue(fakeUser);

      await getProfile(mockReq, mockRes);

      expect(findUserById).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Berhasil mengambil profil",
        user: fakeUser,
      });
    });

    it("❌ Gagal karena user tidak ditemukan (Status 404)", async () => {
      // Skenario: Database mengembalikan null (user tidak ada)
      findUserById.mockResolvedValue(null);

      await getProfile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ error: "NOT_FOUND" }));
    });
  });

  // TEST SUITE 2: UPDATE PROFILE

  describe("updateProfile", () => {
    it("✅ Berhasil memperbarui nama profil (Status 200)", async () => {
      mockReq.body = { name: "Nama Baru" };
      const updatedFakeUser = { id: 1, name: "Nama Baru" };
      
      updateUser.mockResolvedValue(updatedFakeUser);

      await updateProfile(mockReq, mockRes);

      expect(updateUser).toHaveBeenCalledWith(1, { name: "Nama Baru" });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Profil berhasil diperbarui",
        user: updatedFakeUser,
      });
    });

    it("❌ Gagal karena nama kosong (Status 400)", async () => {
      mockReq.body = {}; // name tidak dikirim

      await updateProfile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ error: "VALIDATION_ERROR" }));
      expect(updateUser).not.toHaveBeenCalled(); // Database tidak boleh disentuh
    });
  });

  // TEST SUITE 3: CHANGE PASSWORD

  describe("changePassword", () => {
    // Sembunyikan peringatan console.error saat testing error supaya terminal tetap bersih
    beforeAll(() => {
      jest.spyOn(console, "error").mockImplementation(() => {});
    });
    afterAll(() => {
      console.error.mockRestore();
    });

    it("✅ Berhasil mengganti password (Status 200)", async () => {
      mockReq.body = { oldPassword: "passwordLama123", newPassword: "passwordBaru456" };
      
      const fakeUser = { id: 1, password_hash: "hashLama" };
      findUserById.mockResolvedValue(fakeUser); // User ditemukan
      bcrypt.compare.mockResolvedValue(true); // Password lama cocok
      bcrypt.hash.mockResolvedValue("hashBaru"); // Hash password baru berhasil
      updateUser.mockResolvedValue({ id: 1 }); // Update DB berhasil

      await changePassword(mockReq, mockRes);

      expect(bcrypt.compare).toHaveBeenCalledWith("passwordLama123", "hashLama");
      expect(bcrypt.hash).toHaveBeenCalledWith("passwordBaru456", 10);
      expect(updateUser).toHaveBeenCalledWith(1, { password_hash: "hashBaru" });
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("❌ Gagal karena input form tidak lengkap (Status 400)", async () => {
      mockReq.body = { oldPassword: "passwordLama123" }; // newPassword kurang

      await changePassword(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ error: "VALIDATION_ERROR" }));
    });

    it("❌ Gagal karena password lama salah (Status 401)", async () => {
      mockReq.body = { oldPassword: "passwordLamaSalah", newPassword: "passwordBaru456" };
      
      const fakeUser = { id: 1, password_hash: "hashLama" };
      findUserById.mockResolvedValue(fakeUser); 
      bcrypt.compare.mockResolvedValue(false); // 👈 Disimulasikan password tidak cocok!

      await changePassword(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ error: "UNAUTHORIZED" }));
      expect(bcrypt.hash).not.toHaveBeenCalled(); // Enkripsi tidak boleh dijalankan
    });
  });
});