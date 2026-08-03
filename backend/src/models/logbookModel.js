const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//tampilkan logbook berdasarkan id user
const getLogbookById = async (user_id) => {
  return await prisma.logbookEntry.findMany({
    where: {
      user_id: parseInt(user_id, 10),
    },
    include: {
      attachments: true,
      feedbacks: {
        orderBy: {
          created_at: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      activity_date: "desc",
    },
  });
};

const getLogbookByIdAndUser = async (logbookId, userId) => {
  return await prisma.logbookEntry.findFirst({
    where: {
      id: parseInt(logbookId, 10),
      user_id: parseInt(userId, 10),
    },
  });
};

const updateLogbookStatusToSubmitted = async (logbookId) => {
  return await prisma.logbookEntry.update({
    where: {
      id: parseInt(logbookId, 10),
    },
    data: {
      status: "submitted",
      status_changed_at: new Date(),
    },
    include: {
      attachments: true,
    },
  });
};

//CREATE
const createLogbookEntry = async (data) => {
  return await prisma.logbookEntry.create({
    data: data,
    include: {
      attachments: true,
    },
  });
};

//DETAIL
const getLogbookDetail = async (logbookId, userId) => {
  return await prisma.logbookEntry.findFirst({
    where: {
      id: parseInt(logbookId, 10),
      user_id: parseInt(userId, 10),
    },
    include: {
      attachments: true,
      feedbacks: {
        orderBy: {
          created_at: "desc",
        },
        take: 1,
      },
    },
  });
};

//UPDATE
const updateLogbookEntry = async (logbookId, data) => {
  return await prisma.logbookEntry.update({
    where: {
      id: parseInt(logbookId, 10),
    },
    data: data,
    include: {
      attachments: true,
    },
  });
};

//DELETE
const deleteLogbookEntry = async (logbookId) => {
  return await prisma.logbookEntry.delete({
    where: {
      id: parseInt(logbookId, 10),
    },
    include: {
      attachments: true,
    },
  });
};

module.exports = {
  getLogbookById,
  createLogbookEntry,
  getLogbookDetail,
  updateLogbookEntry,
  deleteLogbookEntry,
  getLogbookByIdAndUser,
  updateLogbookStatusToSubmitted,
};
