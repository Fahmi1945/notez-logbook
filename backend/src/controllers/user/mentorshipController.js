require("dotenv").config();

const { findMentors } = require("../models/userModel");
const {
  createMentorship,
  findPendingRequest,
  getMyRequestedMentors,
  getQueueList,
} = require("../models/mentorship");

// Fungsi request ke mentorship
const requestMentorship = async (req, res) => {
  try {
    const userId = req.user.id;
    const mentorId = req.params.id;

    // simpan data request ke database melalui fungsi di model
    const newRequest = await createMentorship(
      parseInt(userId),
      parseInt(mentorId),
    );

    // Respons Berhasil
    return res.status(200).json({
      status: "success",
      message: "Request mentorship berhasil dikirim.",
      data: {
        requestId: newRequest.id,
        userId: newRequest.userId,
        mentorId: newRequest.mentorId,
        status: newRequest.status,
      },
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        status: "error",
        message:
          "Anda sudah pernah mengajukan request bimbingan ke mentor ini sebelumnya.",
      });
    }

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
      data: mentorship,
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
    // 1. Ambil ID dan ROLE secara aman dari Token JWT via middleware verifyToken
    const currentUserId = req.user.id;
    const currentUserRole = req.user.role.toUpperCase(); // Antisipasi jika ada perbedaan casing (user vs USER)

    // 2. JIKA YANG LOGIN ADALAH MAHASISWA (USER / STUDENT)
    if (currentUserRole === "USER") {
      // Panggil model untuk mengambil riwayat request berdasarkan ID mahasiswa tersebut
      const history = await getMyRequestedMentors(currentUserId);

      const formattedData = history.map((item) => ({
        requestId: item.id,
        status: item.status, // Pending/Accepted/Rejected
        information: item.information,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        mentorId: item.mentor.id,
        mentorName: item.mentor.name,
      }));

      return res.status(200).json({
        status: "success",
        role: "USER",
        message: "Berhasil mengambil riwayat request milik Anda.",
        data: formattedData,
      });
    }

    // 3. JIKA YANG LOGIN ADALAH MENTOR
    if (currentUserRole === "MENTOR") {
      // Panggil model untuk mengambil antrean mahasiswa berdasarkan ID mentor tersebut
      const queue = await getQueueList(currentUserId);

      const formattedData = queue.map((item) => ({
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
        message: "Berhasil mengambil daftar antrean mahasiswa masuk.",
        data: formattedData,
      });
    }

    // 4. JIKA ROLE TIDAK DIKENALI
    return res.status(403).json({
      error: "FORBIDDEN",
      message:
        "Role Anda tidak memiliki akses untuk melihat riwayat mentorship.",
    });
  } catch (error) {
    console.error("Error di getMentorshipHistory:", error);
    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Terjadi kesalahan server saat mengambil riwayat.",
    });
  }
};
// fungsi update status request mentorship
// const updateStatus = async (req, res) => {
//   try {
//     const requestId = req.params.id; // Tangkap ID dari URL
//     const { action } = req.body;      // Tangkap status baru dari body ("ACCEPTED" atau "REJECTED")

//     if (!action || (action !== "ACCEPTED" && action !== "REJECTED")) {
//        return res.status(400).json({
//          error: "VALIDATION_ERROR",
//          message: "Status tidak valid. Harus 'ACCEPTED' atau 'REJECTED'."
//        });
//     }

//     const updatedRequest = await updateRequestStatus(parseInt(requestId), action);

//     return res.status(200).json({
//       status: "success",
//       message: `Status request berhasil diubah menjadi ${action}.`,
//       data: updatedRequest
//     });

//   } catch (error) {
//     console.error("Error di updateStatus:", error);
//     return res.status(500).json({
//       error: "INTERNAL_SERVER_ERROR",
//       message: "Terjadi kesalahan saat mengupdate status request.",
//     });
//   }
// };
module.exports = { requestMentorship, getMentorsList, getMentorshipHistory };
