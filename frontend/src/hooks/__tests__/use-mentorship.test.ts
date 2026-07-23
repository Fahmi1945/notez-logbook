import { renderHook, act, waitFor } from "@testing-library/react";
import { useMentorship } from "../use-mentorship";
import { mentorshipApi } from "@/lib/api/mentorship";
import { useUIStore } from "@/store/ui-store";
import { MentorshipHistory } from "@/types/mentorship";

// --- MOCK DEPENDENCIES ---

// Mock seluruh modul mentorshipApi agar tidak ada request HTTP sungguhan
jest.mock("@/lib/api/mentorship", () => ({
  mentorshipApi: {
    getMentors: jest.fn(),
    getHistory: jest.fn(),
    requestMentorship: jest.fn(),
    getActiveStudents: jest.fn(),
  },
}));

// Mock Zustand store: ganti showToast dengan spy function
jest.mock("@/store/ui-store", () => ({
  useUIStore: jest.fn(),
}));

// Data dummy
const mockMentors = [
  { id: 1, name: "Dr. Budi", email: "budi@example.com", studentCount: 3 },
];

const mockHistory: MentorshipHistory[] = [
  {
    id: 1,
    user_id: 10,
    mentor_id: 1,
    mentor_name: "Dr. Budi",
    status: "pending",
    information: null,
    created_at: "2024-01-01T00:00:00Z",
  },
];

// Helper: cast mock agar TypeScript tidak komplain
const mockMentorshipApi = mentorshipApi as jest.Mocked<typeof mentorshipApi>;
const mockShowToast = jest.fn();

// --- SETUP & TEARDOWN ---

beforeEach(() => {
  jest.clearAllMocks();

  // Setup return value untuk useUIStore mock
  (useUIStore as unknown as jest.Mock).mockReturnValue({
    showToast: mockShowToast,
  });

  // Default: semua API mengembalikan data kosong
  mockMentorshipApi.getMentors.mockResolvedValue([]);
  mockMentorshipApi.getHistory.mockResolvedValue({ data: [] });
  mockMentorshipApi.requestMentorship.mockResolvedValue({
    message: "Berhasil mengajukan bimbingan!",
  });
});

// --- TEST CASES ---

describe("useMentorship", () => {
  describe("Tab 'catalog'", () => {
    it("harus fetch mentors dan history saat tab 'catalog'", async () => {
      mockMentorshipApi.getMentors.mockResolvedValue(mockMentors);
      mockMentorshipApi.getHistory.mockResolvedValue({ data: mockHistory });

      const { result } = renderHook(() => useMentorship("catalog"));

      // Saat awal, isLoading harus true
      expect(result.current.isLoading).toBe(true);

      // Tunggu sampai data tersedia
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.mentors).toEqual(mockMentors);
      expect(result.current.history).toEqual(mockHistory);
    });

    it("harus memanggil getMentors dan getHistory masing-masing 1 kali", async () => {
      const { result } = renderHook(() => useMentorship("catalog"));

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(mockMentorshipApi.getMentors).toHaveBeenCalledTimes(1);
      expect(mockMentorshipApi.getHistory).toHaveBeenCalledTimes(1);
    });
  });

  describe("Tab 'history'", () => {
    it("harus fetch history saja (tidak fetch mentors) saat tab 'history'", async () => {
      mockMentorshipApi.getHistory.mockResolvedValue({ data: mockHistory });

      const { result } = renderHook(() => useMentorship("history"));

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.history).toEqual(mockHistory);
      // getMentors tidak boleh dipanggil
      expect(mockMentorshipApi.getMentors).not.toHaveBeenCalled();
    });
  });

  describe("applyForMentorship", () => {
    it("harus memanggil requestMentorship dan showToast sukses", async () => {
      const { result } = renderHook(() => useMentorship("catalog"));
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await act(async () => {
        await result.current.applyForMentorship(1);
      });

      expect(mockMentorshipApi.requestMentorship).toHaveBeenCalledWith(1);
      expect(mockShowToast).toHaveBeenCalledWith(
        "Berhasil mengajukan bimbingan!",
        "success"
      );
    });

    it("harus menampilkan toast error dan throw jika validasi gagal (mentorId = 0)", async () => {
      const { result } = renderHook(() => useMentorship("catalog"));
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await expect(
        act(async () => {
          await result.current.applyForMentorship(0);
        })
      ).rejects.toThrow();

      // API tidak boleh dipanggil karena validasi gagal duluan
      expect(mockMentorshipApi.requestMentorship).not.toHaveBeenCalled();
      expect(mockShowToast).toHaveBeenCalledWith(
        expect.any(String),
        "error"
      );
    });

    it("harus menampilkan toast error jika API gagal", async () => {
      mockMentorshipApi.requestMentorship.mockRejectedValue({
        response: { data: { message: "Server sedang down" } },
      });

      const { result } = renderHook(() => useMentorship("catalog"));
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await expect(
        act(async () => {
          await result.current.applyForMentorship(1);
        })
      ).rejects.toBeDefined();

      expect(mockShowToast).toHaveBeenCalledWith("Server sedang down", "error");
    });
  });
});
