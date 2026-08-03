const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { updateMentorshipStatus, getMentorActiveTeam, getMentorshipById } = require("../../models/mentorshipModel");


const { createNotificationData } = require("../../models/notificationModel");


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

    const updatedRequest = await updateMentorshipStatus(requestId, action, information);

    const targetStudentId = existingRequest.user_id; // Mengambil ID mahasiswa dari data pengajuan
    if (targetStudentId) {
      const statusIndo = action === "accepted" ? "DITERIMA" : "DITOLAK";
      await createNotificationData({
        user_id: targetStudentId, // Kirim ke Mahasiswa
        message: `Pengajuan bimbingan Anda telah ${statusIndo} oleh mentor. ${information ? `Catatan: "${information}"` : ""}`,
        mentorships_id: Number(requestId)
      });
      console.log(`✅ BERHASIL: Notifikasi Accept/Reject dikirim ke Mahasiswa ID: ${targetStudentId}`);
    }

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



const getMyTeam = async (req, res) => {
  try {
    const mentorId = req.user.id;

    const activeTeam = await getMentorActiveTeam(mentorId);

    const formattedTeam = await Promise.all(activeTeam.map(async (item) => {
      
      // Hitung logbook asli dari database
      const total = await prisma.logbookEntry.count({ 
        where: { user_id: item.user.id } 
      });

      const pending = await prisma.logbookEntry.count({ 
        where: { user_id: item.user.id, status: "draft" } 
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