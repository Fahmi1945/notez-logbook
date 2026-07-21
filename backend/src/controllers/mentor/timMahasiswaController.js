// 1. Panggil Prisma untuk keperluan menghitung total logbook
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 2. Sesuaikan import dengan fungsi Model terbaru yang kita buat tadi
const { updateMentorshipStatus, getMentorActiveTeam, getMentorshipById } = require("../../models/mentorshipModel");


// Fungsi untuk Menyetujui atau Menolak Request Mahasiswa

const handleMentorshipDecision = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { information } = req.body; 
    
    // LOGIKA ANTI-SPAM (Pengecekan Status)
    const existingRequest = await getMentorshipById(requestId);
    
    if (!existingRequest) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "Data pengajuan bimbingan tidak ditemukan."
      });
    }

    if (existingRequest.status !== "pending") {
      return res.status(409).json({
        error: "CONFLICT",
        message: `Oops! Pengajuan ini sudah diproses dan berstatus '${existingRequest.status}'.`
      });
    }
    // BATAS LOGIKA ANTI-SPAM

    let action; 
    if (req.path.endsWith("/accepted")) {
      action = "accepted";
    } else if (req.path.endsWith("/rejected")) {
      action = "rejected";
    } else {
      return res.status(400).json({ error: "BAD_REQUEST", message: "URL tidak valid." });
    }

    // Eksekusi update status di database
    const updatedRequest = await updateMentorshipStatus(requestId, action, information);

    return res.status(200).json({
      status: "success",
      message: `Request mentorship berhasil di-${action}.`,
      data: updatedRequest,
      information: information
    });
  } catch (error) {
    console.error("Error di handleMentorshipDecision:", error);
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR", message: "Gagal memproses keputusan mentor." });
  }
};


// Fungsi untuk Melihat Daftar Semua Mahasiswa Aktif dalam Tim Mentor

const getMyTeam = async (req, res) => {
  try {
    const mentorId = req.user.id;

    // 3. Gunakan fungsi getMentorActiveTeam agar HANYA menarik yang 'accepted'
    const activeTeam = await getMentorActiveTeam(mentorId);

    // 4. Kita aktifkan kembali Promise.all untuk menghitung logbook asli!
    const formattedTeam = await Promise.all(activeTeam.map(async (item) => {
      
      // Hitung logbook asli dari database
      const total = await prisma.logbookEntry.count({ 
        where: { user_id: item.user.id } 
      });

      const pending = await prisma.logbookEntry.count({ 
        where: { user_id: item.user.id, status: 'draft' } 
      });

      return {
        requestId: item.id,
        studentId: item.user.id,
        studentName: item.user.name,
        studentEmail: item.user.email,
        status: item.status, // Pasti akan selalu 'accepted'
        information: item.information,
        updatedAt: item.updated_at,
        totalEntries: total,     // Angka asli dari database
        waitingReview: pending   // Angka asli dari database
      };
    }));

    return res.status(200).json({
      status: "success",
      message: "Berhasil mengambil daftar tim mahasiswa bimbingan aktif.",
      data: formattedTeam
    });
  } catch (error) {
    console.error("Error di getMyTeam:", error);
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR", message: "Gagal mengambil data tim mahasiswa." });
  }
};

module.exports = { handleMentorshipDecision, getMyTeam };