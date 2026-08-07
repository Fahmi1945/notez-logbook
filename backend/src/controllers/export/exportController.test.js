// exportController.test.js
const { Buffer } = require("node:buffer");

// 1. MOCKING DEPENDENCIES (Memalsukan fungsi dari file lain)
jest.mock("../../services/pdfServices", () => ({
  generateLogbookPDF: jest.fn(),
}));

jest.mock("../../models/logbookModel", () => ({
  getLogbooksForExport: jest.fn(),
}));

jest.mock("../../models/mentorshipModel", () => ({
  checkAcceptedMentorship: jest.fn(),
}));

// Import fungsi asli yang sudah di-mock dependencies-nya
const { generateLogbookPDF } = require("../../services/pdfServices");
const { getLogbooksForExport } = require("../../models/logbookModel");
const { checkAcceptedMentorship } = require("../../models/mentorshipModel");
const { exportMyLogbookToPDF } = require("./exportController"); // Sesuaikan path jika perlu

describe("Export Controller Tests", () => {
  let req, res;

  beforeEach(() => {
    // Memalsukan Request dari Express
    req = {
      user: { id: 10, name: "Budi Santoso" },
      query: { startDate: "2023-01-01", endDate: "2023-12-31" },
    };

    // Memalsukan Response dari Express
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      setHeader: jest.fn(),
      send: jest.fn(),
    };

    // Bersihkan sisa memori test sebelumnya
    jest.clearAllMocks();
  });

  it("1. Harus mereturn 404 jika tidak ada satupun logbook yang berstatus 'approved'", async () => {
    // Simulasi database hanya mengembalikan logbook berstatus 'pending'
    getLogbooksForExport.mockResolvedValue([{ id: 1, status: "pending" }]);

    await exportMyLogbookToPDF(req, res);

    expect(getLogbooksForExport).toHaveBeenCalledWith(10, "2023-01-01", "2023-12-31");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Anda belum memiliki logbook untuk di-export."
    });
  });

  it("2. Harus mereturn PDF buffer & status 200 jika logbook 'approved' dan mentor tersedia", async () => {
    // Simulasi data dari Database
    const mockLogbooks = [{ id: 1, status: "approved", activity: "Ngoding" }];
    getLogbooksForExport.mockResolvedValue(mockLogbooks);
    
    // Simulasi punya mentor
    checkAcceptedMentorship.mockResolvedValue({ mentor: { name: "Pak Dosen" } });
    
    // Simulasi hasil cetak PDF (hanya buffer kosong)
    const mockPdfBuffer = Buffer.from("dummy-pdf-content");
    generateLogbookPDF.mockResolvedValue(mockPdfBuffer);

    await exportMyLogbookToPDF(req, res);

    // Pastikan data disusun sesuai format yang benar ke layanan PDF
    expect(generateLogbookPDF).toHaveBeenCalledWith({
      student: { name: "Budi Santoso" },
      mentor: { name: "Pak Dosen" },
      logbooks: mockLogbooks
    });

    // Cek apakah Header merespons dengan tipe PDF yang benar
    expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "application/pdf");
    expect(res.setHeader).toHaveBeenCalledWith("Content-Disposition", "attachment; filename=Logbook_Budi_Santoso.pdf");
    
    // Cek status akhir
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(mockPdfBuffer);
  });

  it("3. Harus tetap sukses (200) dengan tulisan 'Belum ada Mentor' jika user tidak memiliki mentor aktif", async () => {
    getLogbooksForExport.mockResolvedValue([{ id: 1, status: "approved" }]);
    
    // Simulasi database tidak menemukan mentor (mereturn null)
    checkAcceptedMentorship.mockResolvedValue(null);
    generateLogbookPDF.mockResolvedValue(Buffer.from("dummy"));

    await exportMyLogbookToPDF(req, res);

    // Cek apakah data mentor diatur ke nilai default dengan benar
    expect(generateLogbookPDF).toHaveBeenCalledWith(
      expect.objectContaining({
        mentor: { name: "Belum ada Mentor" }
      })
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("4. Harus mereturn 500 jika terjadi kesalahan sistem (Internal Error)", async () => {
    // 1. BUNGKAM CONSOLE ERROR SEMENTARA
    // Kita menugaskan mata-mata (spy) untuk menahan error agar tidak tampil di terminal
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    // 2. Simulasi database meledak / error
    getLogbooksForExport.mockRejectedValue(new Error("Database Down!"));

    await exportMyLogbookToPDF(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Terjadi kesalahan internal saat mengekspor PDF."
    });

    // 3. KEMBALIKAN FUNGSI CONSOLE ERROR SEPERTI SEMULA
    // Ini sangat penting agar jika ada error beneran di test lain, kita tetap bisa melihatnya
    consoleSpy.mockRestore();
  });
});