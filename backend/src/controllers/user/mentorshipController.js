require("dotenv").config();

const { findMentors } = require("../../models/userModel");
const { createMentorship, findPendingRequest, getMyRequestedMentors, getQueueList, getAllStudentsByMentor } = require("../../models/mentorshipModel");

// Fungsi request ke mentorship
const requestMentorship = async (req, res) => {
  try {
    const userId = req.user.id; // Tangkap ID mahasiswa dari token yang sudah diverifikasi
    const mentorId = req.params.id;

    const existingRequest = await findPendingRequest(userId, mentorId);

    if (existingRequest) {
      return res.status(409).json({
        error: "CONFLICT",
        message: "Sabar ya! Kamu sudah mengajukan request ke mentor ini dan masih menunggu persetujuan."
      });
    }

    // simpan data request ke database melalui fungsi di model  
    const newRequest = await createMentorship(parseInt(userId), parseInt(mentorId));

    // Respons Berhasil
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

// Fungsi untuk mengambil daftar mentor
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

// Fungsi untuk mengambil riwayat request mentorship milik mahasiswa
const getMentorshipHistory = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const loggedInUserRole = req.user.role; 

    // JIKA MAHASISWA YANG AKSES (Hanya melihat riwayat pribadinya)
    if (loggedInUserRole === "user") {
      const history = await getMyRequestedMentors(loggedInUserId);
      
      const formattedData = history.map(item => ({
        requestId: item.id,
        status: item.status,           // Untuk menyaring tab 'Pending' atau 'Aktif' di frontend mahasiswa
        information: item.information, // Melihat pesan balasan/catatan dari mentor
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        mentorId: item.mentor.id,
        mentorName: item.mentor.name,  // Properti khusus Mahasiswa: Melihat nama mentornya
      }));

      return res.status(200).json({
        status: "success",
        role: "USER",
        message: "Berhasil mengambil riwayat pengajuan milik mahasiswa.",
        data: formattedData
      });
    }

    // JIKA MENTOR YANG AKSES (Melihat seluruh tim & antrean seperti di gambarmu)
    if (loggedInUserRole === "mentor") {
      const queue = await getAllStudentsByMentor(loggedInUserId);
      
      const formattedData = queue.map(item => ({
        requestId: item.id,
        status: item.status,           // Untuk menyaring tab 'Antrean' atau 'Tim' di frontend mentor
        information: item.information, // Catatan yang mentor berikan ke mahasiswa ini
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        studentId: item.user.id,
        studentName: item.user.name,   // Properti khusus Mentor: Melihat nama mahasiswanya
      }));

      return res.status(200).json({
        status: "success",
        role: "MENTOR",
        message: "Berhasil mengambil seluruh daftar bimbingan milik mentor.",
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