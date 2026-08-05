const { generateLogbookPDF } = require("../../services/pdfServices");
const { getLogbooksForExport } = require("../../models/logbookModel");
const { checkAcceptedMentorship } = require("../../models/mentorshipModel");

const exportMyLogbookToPDF = async (req, res) => {
  try {
    const userId = req.user.id;

    // Ambil nama user dari token (Sesuai pembahasan kita sebelumnya)
    // Jika nama tidak ada di token, kita gunakan default "Mahasiswa"
    const studentName = req.user.name || "Mahasiswa";
    
    const { startDate, endDate } = req.query;

    // 1. Ambil Semua Logbook milik User menggunakan Model
    const logbooks = await getLogbooksForExport(userId, startDate, endDate);


    const approvedLogbooks = logbooks.filter(lb => lb.status === "approved");

    if (!approvedLogbooks || approvedLogbooks.length === 0) {
      return res.status(404).json({ message: "Anda belum memiliki logbook untuk di-export." });
    }

    // 2. Cari data Mentor menggunakan Model (Opsional)
    const activeMentor = await checkAcceptedMentorship(userId);

    let mentorName = "Belum ada Mentor";
    // Cek dengan aman apakah data mentor dan namanya tersedia
    if (activeMentor && activeMentor.mentor && activeMentor.mentor.name) {
      mentorName = activeMentor.mentor.name;
    }

    // 3. Susun Data Sesuai Format Template PDF
    const pdfData = {
      student: { name: studentName },
      mentor: { name: mentorName },
      logbooks: logbooks
    };

    // 4. Generate PDF
    const pdfBuffer = await generateLogbookPDF(pdfData);

    // Bersihkan nama file (Ganti spasi dengan garis bawah)
    const safeFileName = studentName.replace(/\s+/g, "_");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=Logbook_${safeFileName}.pdf`);

    return res.status(200).send(pdfBuffer);

  } catch (error) {
    console.error("[Export PDF Error]:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan internal saat mengekspor PDF."
    });
  }
};

module.exports = {
  exportMyLogbookToPDF
};
