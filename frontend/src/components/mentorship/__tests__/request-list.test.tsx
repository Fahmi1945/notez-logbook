import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { RequestList } from "../request-list";
import { MentorshipHistory } from "@/types/mentorship";

// Catatan: komponen request-list.tsx membaca field camelCase (requestId, mentorName,
// createdAt, updatedAt) dari data, sementara MentorshipHistory mendefinisikan
// field snake_case (id, mentor_name, created_at). Data dari API di-transform
// sebelum masuk komponen. Di sini kita pakai cast agar test tetap realistis.
type RequestListItem = MentorshipHistory & {
  requestId: number;
  mentorName?: string;
  createdAt: string;
  updatedAt?: string;
};

const makeItem = (overrides: Partial<RequestListItem>): RequestListItem => ({
  id: 1,
  userId: 10,
  mentorId: 20,
  status: "pending",
  information: null,
  createdAt: "2024-01-15T10:00:00Z",
  requestId: 1,
  mentorName: "Dr. Budi Santoso",
  ...overrides,
});

const mockHistory: RequestListItem[] = [
  makeItem({ id: 1, requestId: 1, mentorName: "Dr. Budi Santoso", status: "pending", information: null }),
  makeItem({ id: 2, requestId: 2, mentorName: "Prof. Sari Dewi", status: "accepted", information: "Selamat, Anda diterima menjadi mahasiswa bimbingan saya." }),
  makeItem({ id: 3, requestId: 3, mentorName: "Dr. Eko Purnomo", status: "rejected", information: "Maaf, kuota bimbingan sudah penuh." }),
];

describe("RequestList", () => {
  it("harus menampilkan pesan kosong jika tidak ada riwayat", () => {
    render(<RequestList history={[]} />);
    expect(
      screen.getByText("Belum ada riwayat pengajuan bimbingan.")
    ).toBeInTheDocument();
  });

  it("harus menampilkan semua nama mentor dari history", () => {
    render(<RequestList history={mockHistory as unknown as MentorshipHistory[]} />);
    expect(screen.getByText("Dr. Budi Santoso")).toBeInTheDocument();
    expect(screen.getByText("Prof. Sari Dewi")).toBeInTheDocument();
    expect(screen.getByText("Dr. Eko Purnomo")).toBeInTheDocument();
  });

  it("harus menampilkan badge status 'Menunggu' untuk status pending", () => {
    render(<RequestList history={[mockHistory[0]] as unknown as MentorshipHistory[]} />);
    expect(screen.getByText("Menunggu")).toBeInTheDocument();
  });

  it("harus menampilkan badge status 'Diterima' untuk status accepted", () => {
    render(<RequestList history={[mockHistory[1]] as unknown as MentorshipHistory[]} />);
    expect(screen.getByText("Diterima")).toBeInTheDocument();
  });

  it("harus menampilkan badge status 'Ditolak' untuk status rejected", () => {
    render(<RequestList history={[mockHistory[2]] as unknown as MentorshipHistory[]} />);
    expect(screen.getByText("Ditolak")).toBeInTheDocument();
  });

  it("harus TIDAK menampilkan pesan mentor sebelum baris diklik", () => {
    render(<RequestList history={[mockHistory[1]] as unknown as MentorshipHistory[]} />);
    expect(
      screen.queryByText("Selamat, Anda diterima menjadi mahasiswa bimbingan saya.")
    ).not.toBeInTheDocument();
  });

  it("harus MENAMPILKAN pesan mentor setelah baris diklik (expand)", () => {
    render(<RequestList history={[mockHistory[1]] as unknown as MentorshipHistory[]} />);
    fireEvent.click(screen.getByText("Prof. Sari Dewi"));
    expect(
      screen.getByText("Selamat, Anda diterima menjadi mahasiswa bimbingan saya.")
    ).toBeInTheDocument();
  });

  it("harus MENYEMBUNYIKAN pesan kembali jika baris yang sama diklik lagi (toggle)", () => {
    render(<RequestList history={[mockHistory[1]] as unknown as MentorshipHistory[]} />);
    const row = screen.getByText("Prof. Sari Dewi");

    fireEvent.click(row); // buka
    expect(
      screen.getByText("Selamat, Anda diterima menjadi mahasiswa bimbingan saya.")
    ).toBeInTheDocument();

    fireEvent.click(row); // tutup
    expect(
      screen.queryByText("Selamat, Anda diterima menjadi mahasiswa bimbingan saya.")
    ).not.toBeInTheDocument();
  });

  it("harus menampilkan teks 'Belum ada pesan / catatan.' jika information null", () => {
    render(<RequestList history={[mockHistory[0]] as unknown as MentorshipHistory[]} />);
    fireEvent.click(screen.getByText("Dr. Budi Santoso"));
    expect(screen.getByText("Belum ada pesan / catatan.")).toBeInTheDocument();
  });

  it("hanya boleh membuka 1 baris pada satu waktu (accordion behavior)", () => {
    render(<RequestList history={mockHistory as unknown as MentorshipHistory[]} />);

    // Buka baris pertama
    fireEvent.click(screen.getByText("Dr. Budi Santoso"));
    expect(screen.getByText("Belum ada pesan / catatan.")).toBeInTheDocument();

    // Buka baris kedua → baris pertama harus tertutup otomatis
    fireEvent.click(screen.getByText("Prof. Sari Dewi"));
    expect(screen.queryByText("Belum ada pesan / catatan.")).not.toBeInTheDocument();
    expect(
      screen.getByText("Selamat, Anda diterima menjadi mahasiswa bimbingan saya.")
    ).toBeInTheDocument();
  });
});
