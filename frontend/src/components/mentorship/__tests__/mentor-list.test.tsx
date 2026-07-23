import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MentorList } from "../mentor-list";
import { Mentor } from "@/types/mentorship";

// Mock komponen RequestAction agar tidak perlu render komponen aslinya
// (RequestAction sudah diuji tersendiri di file lain)
jest.mock("../request-action", () => ({
  RequestAction: ({ onApply }: { onApply: () => void }) => (
    <button onClick={onApply} data-testid="mock-apply-btn">
      Ajukan Bimbingan
    </button>
  ),
}));

const mockMentors: Mentor[] = [
  { id: 1, name: "Dr. Budi Santoso", email: "budi@example.com", studentCount: 5 },
  { id: 2, name: "Prof. Sari Dewi", email: "sari@example.com", studentCount: 3 },
  { id: 3, name: "Dr. Eko Purnomo", email: "eko@university.ac.id", studentCount: 8 },
];

describe("MentorList", () => {
  const mockOnApply = jest.fn();

  beforeEach(() => {
    mockOnApply.mockClear();
  });

  it("harus menampilkan semua mentor yang diberikan", () => {
    render(<MentorList mentors={mockMentors} onApply={mockOnApply} />);
    expect(screen.getByText("Dr. Budi Santoso")).toBeInTheDocument();
    expect(screen.getByText("Prof. Sari Dewi")).toBeInTheDocument();
    expect(screen.getByText("Dr. Eko Purnomo")).toBeInTheDocument();
  });

  it("harus menampilkan email mentor", () => {
    render(<MentorList mentors={mockMentors} onApply={mockOnApply} />);
    expect(screen.getByText("budi@example.com")).toBeInTheDocument();
  });

  it("harus menampilkan jumlah mahasiswa yang dibimbing", () => {
    render(<MentorList mentors={mockMentors} onApply={mockOnApply} />);
    expect(screen.getByText("5 Mahasiswa")).toBeInTheDocument();
    expect(screen.getByText("3 Mahasiswa")).toBeInTheDocument();
  });

  it("harus menampilkan pesan kosong jika tidak ada mentor", () => {
    render(<MentorList mentors={[]} onApply={mockOnApply} />);
    expect(
      screen.getByText("Tidak ada mentor yang cocok dengan pencarian Anda.")
    ).toBeInTheDocument();
  });

  it("harus memfilter mentor berdasarkan nama saat mengetik di search", () => {
    render(<MentorList mentors={mockMentors} onApply={mockOnApply} />);
    const searchInput = screen.getByPlaceholderText("Cari nama atau email mentor...");

    fireEvent.change(searchInput, { target: { value: "Sari" } });

    // Hanya Prof. Sari Dewi yang harus terlihat
    expect(screen.getByText("Prof. Sari Dewi")).toBeInTheDocument();
    expect(screen.queryByText("Dr. Budi Santoso")).not.toBeInTheDocument();
    expect(screen.queryByText("Dr. Eko Purnomo")).not.toBeInTheDocument();
  });

  it("harus memfilter mentor berdasarkan email saat mengetik di search", () => {
    render(<MentorList mentors={mockMentors} onApply={mockOnApply} />);
    const searchInput = screen.getByPlaceholderText("Cari nama atau email mentor...");

    fireEvent.change(searchInput, { target: { value: "university.ac.id" } });

    expect(screen.getByText("Dr. Eko Purnomo")).toBeInTheDocument();
    expect(screen.queryByText("Dr. Budi Santoso")).not.toBeInTheDocument();
  });

  it("pencarian harus case-insensitive", () => {
    render(<MentorList mentors={mockMentors} onApply={mockOnApply} />);
    const searchInput = screen.getByPlaceholderText("Cari nama atau email mentor...");

    // Ketik huruf kecil semua
    fireEvent.change(searchInput, { target: { value: "budi" } });

    expect(screen.getByText("Dr. Budi Santoso")).toBeInTheDocument();
  });

  it("harus menampilkan pesan kosong jika pencarian tidak cocok", () => {
    render(<MentorList mentors={mockMentors} onApply={mockOnApply} />);
    const searchInput = screen.getByPlaceholderText("Cari nama atau email mentor...");

    fireEvent.change(searchInput, { target: { value: "zzz tidak ada" } });

    expect(
      screen.getByText("Tidak ada mentor yang cocok dengan pencarian Anda.")
    ).toBeInTheDocument();
  });

  it("harus memanggil onApply dengan mentorId yang benar saat tombol diklik", () => {
    render(<MentorList mentors={[mockMentors[0]]} onApply={mockOnApply} />);
    fireEvent.click(screen.getByTestId("mock-apply-btn"));
    expect(mockOnApply).toHaveBeenCalledWith(1); // id mentor pertama
  });
});
