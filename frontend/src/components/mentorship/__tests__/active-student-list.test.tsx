import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ActiveStudentsList from "../active-student-list";
import { ActiveStudent } from "@/types/mentorship";

const mockStudents: ActiveStudent[] = [
  {
    requestId: 1,
    studentId: 101,
    studentName: "Andi Saputra",
    studentEmail: "andi@example.com",
    status: "ACTIVE",
    information: "Test 1",
    updatedAt: "2023-10-01T10:00:00Z",
    totalEntries: 5,
    waitingReview: 1,
  },
  {
    requestId: 2,
    studentId: 102,
    studentName: "Budi Santoso",
    studentEmail: "budi@example.com",
    status: "ACTIVE",
    information: "Test 2",
    updatedAt: "2023-10-05T10:00:00Z",
    totalEntries: 10,
    waitingReview: 0,
  }
];

describe("ActiveStudentsList", () => {
  it("menampilkan empty state ketika data kosong", () => {
    render(<ActiveStudentsList data={[]} />);
    expect(screen.getByText("Belum ada data mahasiswa aktif.")).toBeInTheDocument();
  });

  it("merender daftar mahasiswa dengan benar", () => {
    render(<ActiveStudentsList data={mockStudents} />);
    
    // Periksa nama mahasiswa
    expect(screen.getByText("Andi Saputra")).toBeInTheDocument();
    expect(screen.getByText("Budi Santoso")).toBeInTheDocument();

    // Periksa total entri
    expect(screen.getByText("5 Entri")).toBeInTheDocument();
    expect(screen.getByText("10 Entri")).toBeInTheDocument();

    // Periksa review (1 perlu review, 1 selesai)
    expect(screen.getByText("1 Perlu Review")).toBeInTheDocument();
    expect(screen.getByText("Selesai")).toBeInTheDocument();
  });

  it("membuka modal detail saat tombol diklik", () => {
    render(<ActiveStudentsList data={mockStudents} />);
    
    // Asumsi tombol Lihat Detail pada baris pertama membuka modal Andi Saputra
    const detailButtons = screen.getAllByRole("button", { name: /lihat detail/i });
    fireEvent.click(detailButtons[0]);

    // Modal seharusnya terbuka dan menampilkan informasi Andi Saputra
    expect(screen.getByText("Detail Mahasiswa")).toBeInTheDocument();
    // Andi di render di list dan juga di modal, sehingga countnya bisa > 1. 
    // Kita cek email-nya saja yang unik di modal jika sebelumnya tidak tampil
    // Karena email Andi tampil di tabel juga, kita cari elemen yang spesifik di Modal
    expect(screen.getByText("Test 1")).toBeInTheDocument(); // text dari information
  });
});
