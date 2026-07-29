const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const createNotificationData = async ({ user_id, title, message, logbook_id, mentorships_id }) => {
  const finalMessage = title ? `[${title}] ${message}` : message;

  console.log("🛠️ [DEBUG Model] Memproses simpan notifikasi untuk User:", user_id);

  return await prisma.notification.create({
    data: {
      // Sesuaikan dengan nama field di schema.prisma (biasanya camelCase)
      user_id: Number(user_id),
      message: finalMessage,
      logbook_id: logbook_id ? Number(logbook_id) : null,
      mentorships_id: mentorships_id ? Number(mentorships_id) : null,
    },
  });
};

const getNotificationsByUserId = async (userId) => {
  return await prisma.notification.findMany({
    where: { user_id: Number(userId) },
    orderBy: { created_at: "desc" },
  });
};

const countUnreadNotificationsByUserId = async (userId) => {
  return await prisma.notification.count({
    where: {
      user_id: Number(userId),
      is_read: false,
    },
  });
};

const markNotificationAsReadData = async (notificationId, userId) => {
  return await prisma.notification.updateMany({
    where: {
      id: Number(notificationId),
      user_id: Number(userId),
    },
    data: {
      is_read: true,
      is_read_date: new Date(),
    },
  });
};

const markAllNotificationsAsReadData = async (userId) => {
  return await prisma.notification.updateMany({
    where: {
      user_id: Number(userId),
      is_read: false,
    },
    data: {
      is_read: true,
      is_read_date: new Date(),
    },
  });
};

const deleteNotificationData = async (notificationId, userId) => {
  return await prisma.notification.deleteMany({
    where: {
      id: Number(notificationId),
      user_id: Number(userId),
    },
  });
};

module.exports = {
  createNotificationData,
  getNotificationsByUserId,
  countUnreadNotificationsByUserId,
  markNotificationAsReadData,
  markAllNotificationsAsReadData,
  deleteNotificationData,
};