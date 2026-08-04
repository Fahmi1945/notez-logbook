import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MentorRequestList from "../mentor-request-list";
import { useMentorRequests } from "@/hooks/use-mentor-request";

// Mock hooks
jest.mock("@/hooks/use-mentor-request");

const mockRequests = [
  {
    requestId: 1,
    studentId: 101,
    studentName: "Andi Saputra",
    studentEmail: "andi@example.com",
    status: "pending",
    information: null,
    createdAt: "2023-10-01T10:00:00Z",
    updatedAt: "2023-10-01T10:00:00Z"
  }
];

describe("MentorRequestList", () => {
  const mockHandleApproval = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useMentorRequests as jest.Mock).mockReturnValue({
      requests: mockRequests,
      isLoading: false,
      handleApproval: mockHandleApproval,
    });
  });

  it("merender state loading", () => {
    (useMentorRequests as jest.Mock).mockReturnValue({
      requests: [],
      isLoading: true,
      handleApproval: mockHandleApproval,
    });
    
    const { container } = render(<MentorRequestList />);
    // Ada elemen svg spinner
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("merender empty state", () => {
    (useMentorRequests as jest.Mock).mockReturnValue({
      requests: [],
      isLoading: false,
      handleApproval: mockHandleApproval,
    });
    
    render(<MentorRequestList />);
    expect(screen.getByText("Tidak ada permintaan bimbingan saat ini.")).toBeInTheDocument();
  });

  it("merender tabel permintaan bimbingan", () => {
    render(<MentorRequestList />);
    
    expect(screen.getByText("Andi Saputra")).toBeInTheDocument();
    expect(screen.getByText("Perlu Persetujuan")).toBeInTheDocument();
  });

  it("membuka modal ketika tombol Terima ditekan dan submit", async () => {
    render(<MentorRequestList />);
    
    const acceptBtn = screen.getByRole("button", { name: /terima/i });
    fireEvent.click(acceptBtn);

    // Modal terbuka
    expect(screen.getByText("Terima Mahasiswa")).toBeInTheDocument();

    // Isi alasan
    const textarea = screen.getByPlaceholderText(/Contoh: Selamat bergabung di tim!/i);
    fireEvent.change(textarea, { target: { value: "Okey!" } });

    // Submit
    const confirmBtn = screen.getByRole("button", { name: /konfirmasi/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(mockHandleApproval).toHaveBeenCalledWith(1, "accept", "Okey!");
    });
  });

  it("membuka modal ketika tombol Tolak ditekan dan submit", async () => {
    render(<MentorRequestList />);
    
    const rejectBtn = screen.getByRole("button", { name: /tolak/i });
    fireEvent.click(rejectBtn);

    // Modal terbuka
    expect(screen.getByText("Tolak Mahasiswa")).toBeInTheDocument();

    // Isi alasan
    const textarea = screen.getByPlaceholderText(/Contoh: Kuota bimbingan sudah penuh./i);
    fireEvent.change(textarea, { target: { value: "Penuh" } });

    // Submit
    const confirmBtn = screen.getByRole("button", { name: /konfirmasi/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(mockHandleApproval).toHaveBeenCalledWith(1, "reject", "Penuh");
    });
  });
});
