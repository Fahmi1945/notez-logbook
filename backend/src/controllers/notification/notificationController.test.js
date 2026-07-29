const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("./notificationController");
const {
  getNotificationsByUserId,
  countUnreadNotificationsByUserId,
  markNotificationAsReadData,
  markAllNotificationsAsReadData,
  deleteNotificationData,
} = require("../../models/notificationModel");

// Mocking Prisma & Model
jest.mock("@prisma/client", () => {
  return { PrismaClient: jest.fn() };
});
jest.mock("../../models/notificationModel");

describe("Notification Controller Unit Tests", () => {
  // Membungkam console.error agar terminal tetap bersih
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      user: { id: 1 },
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // ==========================================
  // TES: getMyNotifications
  // ==========================================
  describe("getMyNotifications", () => {
    it("harus sukses 200 mengembalikan daftar notifikasi dan unreadCount", async () => {
      const mockNotifs = [
        { id: 1, user_id: 1, title: "Logbook Disetujui", message: "Mantap", is_read: false },
      ];
      getNotificationsByUserId.mockResolvedValue(mockNotifs);
      countUnreadNotificationsByUserId.mockResolvedValue(1);

      await getMyNotifications(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          data: { unreadCount: 1, notifications: mockNotifs },
        })
      );
    });

    it("harus 401 jika userId tidak tersedia di request", async () => {
      req.user = undefined;

      await getMyNotifications(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("harus error 500 jika terjadi server error", async () => {
      getNotificationsByUserId.mockRejectedValue(new Error("Database Putus"));

      await getMyNotifications(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ==========================================
  // TES: markAsRead
  // ==========================================
  describe("markAsRead", () => {
    it("harus error 400 jika ID notifikasi bukan angka", async () => {
      req.params.id = "abc";

      await markAsRead(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("harus error 404 jika notifikasi tidak ditemukan", async () => {
      req.params.id = "99";
      markNotificationAsReadData.mockResolvedValue({ count: 0 });

      await markAsRead(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("harus sukses 200 menandai notifikasi sebagai dibaca", async () => {
      req.params.id = "1";
      markNotificationAsReadData.mockResolvedValue({ count: 1 });

      await markAsRead(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Notifikasi berhasil ditandai sebagai dibaca." })
      );
    });

    it("harus error 500 jika terjadi server error", async () => {
      req.params.id = "1";
      markNotificationAsReadData.mockRejectedValue(new Error("Database Error"));

      await markAsRead(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ==========================================
  // TES: markAllAsRead
  // ==========================================
  describe("markAllAsRead", () => {
    it("harus sukses 200 menandai seluruh notifikasi sebagai dibaca", async () => {
      markAllNotificationsAsReadData.mockResolvedValue({ count: 5 });

      await markAllAsRead(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("harus error 500 jika terjadi server error", async () => {
      markAllNotificationsAsReadData.mockRejectedValue(new Error("Database Error"));

      await markAllAsRead(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ==========================================
  // TES: deleteNotification
  // ==========================================
  describe("deleteNotification", () => {
    it("harus error 400 jika ID notifikasi tidak valid", async () => {
      req.params.id = "abc";

      await deleteNotification(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("harus error 404 jika notifikasi tidak ditemukan", async () => {
      req.params.id = "99";
      deleteNotificationData.mockResolvedValue({ count: 0 });

      await deleteNotification(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("harus sukses 200 menghapus notifikasi", async () => {
      req.params.id = "1";
      deleteNotificationData.mockResolvedValue({ count: 1 });

      await deleteNotification(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("harus error 500 jika terjadi server error", async () => {
      req.params.id = "1";
      deleteNotificationData.mockRejectedValue(new Error("Database Error"));

      await deleteNotification(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});