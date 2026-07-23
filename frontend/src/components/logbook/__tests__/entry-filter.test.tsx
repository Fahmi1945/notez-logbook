import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EntryFilter from "../entry-filter";

// Mock next/link dan komponen UI
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, className }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
  }) => (
    <button onClick={onClick} className={className}>{children}</button>
  ),
}));

// Helper: render dengan props default
const renderFilter = (overrides: Partial<Parameters<typeof EntryFilter>[0]> = {}) => {
  const props = {
    searchQuery: "",
    setSearchQuery: jest.fn(),
    statusFilter: "all",
    setStatusFilter: jest.fn(),
    dateFilter: "",
    setDateFilter: jest.fn(),
    ...overrides,
  };
  render(<EntryFilter {...props} />);
  return props;
};

describe("EntryFilter", () => {
  // --- RENDER ---
  it("harus merender search input dengan placeholder yang benar", () => {
    renderFilter();
    expect(screen.getByPlaceholderText("Cari judul kegiatan...")).toBeInTheDocument();
  });

  it("harus merender dropdown filter status dengan semua pilihan", () => {
    renderFilter();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Semua Status" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Approved" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Submitted" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Rejected" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Draft" })).toBeInTheDocument();
  });

  it("harus merender tombol 'Tambah Entri'", () => {
    renderFilter();
    expect(screen.getByText("Tambah Entri")).toBeInTheDocument();
  });

  it("harus merender tombol 'Cetak Laporan'", () => {
    renderFilter();
    expect(screen.getByText("Cetak Laporan")).toBeInTheDocument();
  });

  // --- INTERAKSI: SEARCH ---
  it("harus memanggil setSearchQuery saat mengetik di search input", () => {
    const { setSearchQuery } = renderFilter();
    const input = screen.getByPlaceholderText("Cari judul kegiatan...");
    fireEvent.change(input, { target: { value: "Implementasi" } });
    expect(setSearchQuery).toHaveBeenCalledWith("Implementasi");
  });

  it("harus menampilkan nilai searchQuery dari props", () => {
    renderFilter({ searchQuery: "Login" });
    expect(screen.getByDisplayValue("Login")).toBeInTheDocument();
  });

  // --- INTERAKSI: STATUS FILTER ---
  it("harus memanggil setStatusFilter saat memilih opsi status", () => {
    const { setStatusFilter } = renderFilter();
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "approved" } });
    expect(setStatusFilter).toHaveBeenCalledWith("approved");
  });

  it("harus menampilkan nilai statusFilter dari props", () => {
    renderFilter({ statusFilter: "submitted" });
    expect(screen.getByRole("combobox")).toHaveValue("submitted");
  });

  // --- INTERAKSI: DATE FILTER ---
  it("harus memanggil setDateFilter saat memilih tanggal", () => {
    const { setDateFilter } = renderFilter();
    // Gunakan querySelector karena ada 2 input kosong (search + date)
    const dateInput = document.querySelector("input[type='date']")!;
    fireEvent.change(dateInput, { target: { value: "2024-07-22" } });
    expect(setDateFilter).toHaveBeenCalledWith("2024-07-22");
  });

  // --- NAVIGASI ---
  it("tombol 'Tambah Entri' harus mengarah ke /logbook/new", () => {
    renderFilter();
    const addLink = screen.getByRole("link");
    expect(addLink).toHaveAttribute("href", "/logbook/new");
  });
});
