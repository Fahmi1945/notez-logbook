const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//tampilkan logbook berdasarkan id user
const getLogbookById = async (user_id) => {
  return await prisma.logbookEntry.findMany({
    where: {
      user_id: parseInt(user_id, 10),
    },
    orderBy: {
      activity_date: "desc",
    },
  });
};

//CREATE
const createLogbookEntry = async (data) => {
  return await prisma.logbookEntry.create({
    data: data,
  });
};

//DETAIL
const getLogbookDetail = async (logbookId, userId) => {
  return await prisma.logbookEntry.findUnique({
    where: {
      id: parseInt(logbookId, 10),
      user_id: parseInt(userId, 10),
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
  });
};

//DELETE
const deleteLogbookEntry = async (logbookId) => {
  return await prisma.logbookEntry.delete({
    where: {
      id: parseInt(logbookId, 10),
    },
  });
};

module.exports = {
  getLogbookById,
  createLogbookEntry,
  getLogbookDetail,
  updateLogbookEntry,
  deleteLogbookEntry,
};
