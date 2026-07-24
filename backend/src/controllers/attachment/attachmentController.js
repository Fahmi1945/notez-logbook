const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const path = require("path");
const fs = require("fs");

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

    const pathFile = path.join(process.cwd(), attachment.file_path);
    

    if (!fs.existsSync(pathFile)) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "Attachment not found"
      });
    }

    res.sendFile(pathFile);
  } catch (error) {
    console.error("Error viewAttachment:", error);
    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Terjadi Kesalahan Pada Server"
    });
  }
};

module.exports = {
  viewAttachment,
};
