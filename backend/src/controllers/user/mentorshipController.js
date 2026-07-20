require("dotenv").config();

const { findMentors } = require("../../models/userModel");
const { 
  createMentorship, 
  checkExistingRequest,     // ✨ Menggunakan fungsi Anti-Spam baru
  getMyRequestedMentors, 
  getMentorRequestsHistory  // ✨ Menggunakan fungsi filter khusus Mentor
} = require("../../models/mentorshipModel");

// ============================================================================
// Fungsi request ke mentorship (Dilengkapi Anti-Spam Sempurna)
// ============================================================================
const requestMentorship = async (req, res) => {
  try {
    const userId = req.user.id; 
    const mentorId = req.params.id;

    // ✨ CEK APAKAH SUDAH PERNAH REQUEST (APA PUN STATUSNYA)
    const existingRequest = await checkExistingRequest(userId, mentorId);

    if (existingRequest) {
      if (existingRequest.status === "pending") {
        return res.status(409).json({
          error: "CONFLICT",
          message: "Sabar ya! Kamu sudah mengajukan request ke mentor ini dan masih menunggu persetujuan."
        });
      } else if (existingRequest.status === "accepted") {
        return res.status(409).json({
          error: "CONFLICT",
          message: "Kamu tidak perlu mengajukan lagi, kamu sudah diterima oleh mentor ini."
        });
      } else if (existingRequest.status === "rejected") {
        return res.status(409).json({
          error: "CONFLICT",
          message: "Maaf, pengajuanmu sebelumnya telah ditolak oleh mentor ini. Silakan cari mentor lain."
        });
      }
    }

    // Jika belum pernah ada riwayat sama sekali, simpan data  
    const newRequest = await createMentorship(parseInt(userId), parseInt(mentorId));

    return res.status(200).json({
      status: "success",
      message: "Request mentorship berhasil dikirim.",
      data: {
        requestId: newRequest.id,
        userId: newRequest.user_id,
        mentorId: newRequest.mentor_id,
        status: newRequest.status
      }
    });

  } catch (error) {
    console.error("Error di requestMentorship:", error);
    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Terjadi kesalahan pada server saat memproses request.",
    });
  }
};

// ============================================================================
// Fungsi untuk mengambil daftar mentor
// ============================================================================
const getMentorsList = async (req, res) => {
  try {
    const mentorship = await findMentors();

    return res.status(200).json({
      status: "success",
      message: "Berhasil mengambil daftar mentor.",
      data: mentorship
    });

  } catch (error) {
    console.error("Error di getMentorsList:", error);
    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Terjadi kesalahan saat mengambil data mentor.",
    });
  }
};

// ============================================================================
// Fungsi untuk mengambil riwayat request mentorship (Dipisah by Role)
// ============================================================================
const getMentorshipHistory = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const loggedInUserRole = req.user.role; 

    // 🎓 1. JIKA MAHASISWA YANG AKSES (Melihat semua riwayat pribadinya)
    if (loggedInUserRole === "user") {
      const history = await getMyRequestedMentors(loggedInUserId);
      
      const formattedData = history.map(item => ({
        requestId: item.id,
        status: item.status, 
        information: item.information, 
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        mentorId: item.mentor.id,
        mentorName: item.mentor.name, 
      }));

      return res.status(200).json({
        status: "success",
        role: "USER",
        message: "Berhasil mengambil riwayat pengajuan milik mahasiswa.",
        data: formattedData
      });
    }

    // 👨‍🏫 2. JIKA MENTOR YANG AKSES (Hanya melihat yang pending & rejected)
    if (loggedInUserRole === "mentor") {
      // ✨ Menggunakan getMentorRequestsHistory
      const queue = await getMentorRequestsHistory(loggedInUserId);
      
      const formattedData = queue.map(item => ({
        requestId: item.id,
        status: item.status, 
        information: item.information, 
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        studentId: item.user.id,
        studentName: item.user.name, 
      }));

      return res.status(200).json({
        status: "success",
        role: "MENTOR",
        message: "Berhasil mengambil riwayat request masuk (pending/rejected).",
        data: formattedData
      });
    }

    return res.status(403).json({ 
      error: "FORBIDDEN", 
      message: "Role akun kamu tidak dikenali." 
    });

  } catch (error) {
    console.error("Error di getMentorshipHistory:", error);
    return res.status(500).json({ 
      error: "INTERNAL_SERVER_ERROR", 
      message: "Terjadi kesalahan server saat mengambil riwayat." 
    });
  }
};

module.exports = { requestMentorship, getMentorsList, getMentorshipHistory };