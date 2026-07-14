const { updateMentorshipStatus, getAllStudentsByMentor } = require("../../models/mentorshipModel");

//Fungsi untuk Menyetujui atau Menolak Request Mahasiswa
const handleMentorshipDecision = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { information } = req.body; // Ambil informasi tambahan dari body request
    

    let action;

    if (req.path.endsWith("/accepted")) {
      action = "accepted";
    } else if (req.path.endsWith("/rejected")) {
      action = "rejected";
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

// Fungsi untuk Melihat Daftar Semua User/Mahasiswa dalam Tim Mentor
const getMyTeam = async (req, res) => {
  try {

    const mentorId = req.user.id;

    const team = await getAllStudentsByMentor(mentorId);

//  const getMyTeam = async (req, res) => {
//   try {
//     const mentorId = req.user.id;
//     const team = await getAllStudentsByMentor(mentorId);

//     // Kita gunakan Promise.all agar database selesai menghitung dulu sebelum lanjut
//     const formattedTeam = await Promise.all(team.map(async (item) => {
//       // 1. Hitung total logbook
//       const total = await prisma.logbook.count({ 
//         where: { user_id: item.user.id } 
//       });

//       // 2. Hitung yang masih pending (menunggu review)
//       const pending = await prisma.logbook.count({ 
//         where: { user_id: item.user.id, status: 'pending' } 
//       });

//       // 3. PASANG CCTV DI TERMINAL (Backend)
//       console.log(`DEBUG: Mahasiswa ${item.user.name} | Total: ${total} | Pending: ${pending}`);

    const formattedTeam = team.map(item => ({
      requestId: item.id,
      studentId: item.user.id,
      studentName: item.user.name,
      studentEmail: item.user.email,
      status: item.status,
      information : item.information,
      updatedAt: item.updated_at,
      totalEntries: item.status === 'accepted' ? 10 : 0,
      waitingReview: item.status === 'accepted' ? 2 : 0
    }));

    return res.status(200).json({
      status: "success",
      message: "Berhasil mengambil daftar tim mahasiswa bimbingan.",
      data: formattedTeam
    });
  } catch (error) {
    console.error("Error di getMyTeam:", error);
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR", message: "Gagal mengambil data tim mahasiswa." });
  }
};

module.exports = { handleMentorshipDecision, getMyTeam };