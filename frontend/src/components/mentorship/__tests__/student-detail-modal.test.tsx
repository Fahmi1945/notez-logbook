import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import StudentDetailModal from "../student-detail-modal";
import { ActiveStudent } from "@/types/mentorship";

const mockStudent: ActiveStudent = {
  requestId: 1,
  studentId: 101,
  studentName: "Budi Santoso",
  studentEmail: "budi@example.com",
  status: "ACTIVE",
  information: "Informasi tambahan mahasiswa.",
  updatedAt: "2023-10-01T10:00:00Z",
  totalEntries: 12,
  waitingReview: 2,
};

describe("StudentDetailModal", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it("tidak merender apa-apa jika student null", () => {
    const { container } = render(
      <StudentDetailModal isOpen={true} onClose={mockOnClose} student={null} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("merender informasi mahasiswa dengan benar", () => {
    render(
      <StudentDetailModal isOpen={true} onClose={mockOnClose} student={mockStudent} />
    );

    expect(screen.getByText("Detail Mahasiswa")).toBeInTheDocument();
    expect(screen.getByText("Budi Santoso")).toBeInTheDocument();
    expect(screen.getByText("budi@example.com")).toBeInTheDocument();
    expect(screen.getByText("12 Entri")).toBeInTheDocument();
    expect(screen.getByText("Informasi tambahan mahasiswa.")).toBeInTheDocument();
  });

  it("merender status 'approved' untuk status ACTIVE", () => {
    render(
      <StudentDetailModal isOpen={true} onClose={mockOnClose} student={mockStudent} />
    );
    expect(screen.getByText("ACTIVE")).toBeInTheDocument();
  });

  it("memanggil onClose saat tombol tutup diklik", () => {
    render(
      <StudentDetailModal isOpen={true} onClose={mockOnClose} student={mockStudent} />
    );
    
    const closeBtn = screen.getByRole("button", { name: /tutup/i });
    fireEvent.click(closeBtn);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
