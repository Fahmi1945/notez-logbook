require("dotenv").config();

const { findMentors } = require("../models/userModel");
const { createMentorship, findPendingRequest, getMyRequestedMentors, getQueueList } = require("../models/mentorship");

// Fungsi request ke mentorship
const requestMentorship = async (req, res) => {
  try {
    const userId = 1;
    const mentorId = req.params.id;

    // simpan data request ke database melalui fungsi di model  
    const newRequest = await createMentorship(parseInt(userId), parseInt(mentorId));

    // Respons Berhasil
    return res.status(200).json({
      status: "success",
      message: "Request mentorship berhasil dikirim.",
      data: {
        requestId: newRequest.id,
        userId: newRequest.userId,
        mentorId: newRequest.mentorId,
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
    // Kita tangkap DUA KEMUNGKINAN dari URL
    const { userId, mentorId } = req.query;

    if (userId) {
      const history = await getMyRequestedMentors(userId);
      const formattedData = history.map(item => ({
        requestId: item.id,
        status: item.status, // Tampilan di frontend akan bereaksi dengan status ini (Pending/Accepted/Rejected)
        information: item.information,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        mentorId: item.mentor.id,
        mentorName: item.mentor.name // Mahasiswa melihat nama mentor
      }));

      return res.status(200).json({
        status: "success",
        role: "USER",
        message: "Berhasil mengambil riwayat request milik mahasiswa.",
        data: formattedData
      });
    }

    if (mentorId) {
      const queue = await getQueueList(mentorId);
      const formattedData = queue.map(item => ({
        requestId: item.id,
        status: item.status, 
        information: item.information,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        studentId: item.user.id,
        studentName: item.user.name // Mentor melihat nama mahasiswa yang antre
      }));

      return res.status(200).json({
        status: "success",
        role: "MENTOR",
        message: "Berhasil mengambil daftar antrean mahasiswa masuk.",
        data: formattedData
      });
    }

    return res.status(400).json({ 
      error: "BAD_REQUEST", 
      message: "Sertakan parameter ?userId=angka ATAU ?mentorId=angka di URL." 
    });

  } catch (error) {
    console.error("Error di getMentorshipHistory:", error);
    return res.status(500).json({ 
      error: "INTERNAL_SERVER_ERROR", 
      message: "Terjadi kesalahan server." 
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