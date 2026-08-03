const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const supabase = require("../../config/supabase");


const viewAttachment = async (req, res) => {
  try {
    const attachmentId = parseInt(req.params.id);
    const userId = req.user.id;
    const userRole = req.user.role;

    const attachment = await prisma.attachment.findUnique({
      where: { id: attachmentId },
      include: { logbook_entry: true },
    });

    if (!attachment) {
      return res.status(404).json({ message: "Attachment not found" });
    }

    const logbookOwnerId = attachment.logbook_entry.user_id;

    let isAuthorized = false;

    if (userRole === "user") {
      if (userId === logbookOwnerId) {
        isAuthorized = true;
      }
    } else if (userRole === "mentor") {
      const activeMentorships = await prisma.mentorship.findFirst({
        where: {
          mentor_id: userId,
          user_id: logbookOwnerId,
          status: "accepted",
        },
      });
      if (activeMentorships) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return res.status(403).json({
        error: "FORBIDDEN",
        message: "Unauthorized"
      });
    }

    if (!attachment.file_path) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "File URL is missing"
      });
    }

    // 1. Ambil nama file asli dari akhir file_path
    const fileName = attachment.file_path.split("/").pop();

    // 2. Minta Signed URL ke Supabase (misal valid selama 1 jam / 3600 detik)
    // Pastikan `supabase` sudah di-import di bagian atas file ini
    const { data, error } = await supabase.storage
      .from("attachments")
      .createSignedUrl(fileName, 3600);

    if (error || !data) {
      console.error("Gagal membuat Signed URL:", error);
      return res.status(500).json({
        error: "INTERNAL_SERVER_ERROR",
        message: "Gagal mengambil file dari penyimpanan"
      });
    }

    // 3. Kembalikan URL tersebut dalam bentuk JSON
    return res.status(200).json({
      success: true,
      url: data.signedUrl,
    });

  } catch (error) {
    console.error("Error viewAttachment:", error);
    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Terjadi Kesalahan Pada Server"
    });
  }
};

/**
 * Helper untuk menghapus file fisik di Supabase Object Storage
 * @param {Array} attachments - Array of attachment objects dari Prisma
 */
const deleteSupabaseAttachments = async (attachments) => {
  try {
    // 1. Cek apakah fungsi ini dipanggil dan datanya masuk

    if (!attachments || attachments.length === 0) {
      console.log(">>> [DEBUG 2] Tidak ada attachment yang perlu dihapus.");
      return;
    }

    const filesToRemove = attachments
      .map((att) => {
        if (!att.file_path) return null;
        return att.file_path.split("/").pop();
      })
      .filter((fileName) => fileName !== null);

    // 2. Cek nama file yang akan dikirim ke Supabase

    if (filesToRemove.length > 0) {
      const { error } = await supabase.storage
        .from("attachments")
        .remove(filesToRemove);

      // 3. Cek respons langsung dari Supabase
      if (error) {
        console.error(">>> [ERROR] Terjadi kesalahan di helper:", error);
        return;
      }
    }
  } catch (err) {
    console.error(">>> [ERROR] Terjadi kesalahan di helper:", err);
    return;
  }
};

module.exports = {
  viewAttachment,
  deleteSupabaseAttachments,
};
