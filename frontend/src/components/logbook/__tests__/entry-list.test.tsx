import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EntryList from "../entry-list";
import { LogbookEntry } from "@/types/entry";

// Mock next/link agar tidak error di jsdom
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock komponen UI Dropdown agar itemnya dirender langsung untuk keperluan test
jest.mock("@/components/ui/dropdown", () => ({
  Dropdown: ({ trigger, children }: { trigger: React.ReactNode; children: React.ReactNode }) => (
    <div>
      {trigger}
      {children}
    </div>
  ),
  DropdownItem: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

const makeEntry = (overrides: Partial<LogbookEntry> = {}): LogbookEntry => ({
  id: 1,
  user_id: 10,
  activity_date: "2024-07-22T00:00:00Z",
  title: "Implementasi Fitur Login",
  description: "Membuat halaman login dengan validasi Zod",
  obstacles: null,
  status: "draft",
  ...overrides,
});

const mockEntries: LogbookEntry[] = [
  makeEntry({ id: 1, title: "Implementasi Login", status: "draft" }),
  makeEntry({ id: 2, title: "Desain Database", status: "submitted" }),
  makeEntry({ id: 3, title: "Review Code", status: "approved" }),
  makeEntry({ id: 4, title: "Perbaikan Bug", status: "rejected", obstacles: "Butuh akses ke server production" }),
];

describe("EntryList", () => {
  const mockOnDelete = jest.fn();

  beforeEach(() => mockOnDelete.mockClear());

  // --- EMPTY STATE ---
  it("harus menampilkan pesan kosong jika entries kosong", () => {
    render(<EntryList entries={[]} onDelete={mockOnDelete} />);
    expect(screen.getByText("Belum ada entri logbook")).toBeInTheDocument();
  });

  // --- RENDER DATA ---
  it("harus menampilkan judul semua entri", () => {
    render(<EntryList entries={mockEntries} onDelete={mockOnDelete} />);
    expect(screen.getAllByText("Implementasi Login")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Desain Database")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Review Code")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Perbaikan Bug")[0]).toBeInTheDocument();
  });

  it("harus menampilkan deskripsi entri", () => {
    render(<EntryList entries={[makeEntry({ description: "Membuat halaman login" })]} onDelete={mockOnDelete} />);
    expect(screen.getAllByText("Membuat halaman login")[0]).toBeInTheDocument();
  });

  // --- STATUS BADGES ---
  it("harus menampilkan badge 'Approved' untuk status approved", () => {
    render(<EntryList entries={[makeEntry({ status: "approved" })]} onDelete={mockOnDelete} />);
    expect(screen.getAllByText("Approved")[0]).toBeInTheDocument();
  });

  it("harus menampilkan badge 'Submitted' untuk status submitted", () => {
    render(<EntryList entries={[makeEntry({ status: "submitted" })]} onDelete={mockOnDelete} />);
    expect(screen.getAllByText("Submitted")[0]).toBeInTheDocument();
  });

  it("harus menampilkan badge 'Rejected' untuk status rejected", () => {
    render(<EntryList entries={[makeEntry({ status: "rejected" })]} onDelete={mockOnDelete} />);
    expect(screen.getAllByText("Rejected")[0]).toBeInTheDocument();
  });

  it("harus menampilkan badge '📝 Draft' untuk status draft", () => {
    render(<EntryList entries={[makeEntry({ status: "draft" })]} onDelete={mockOnDelete} />);
    expect(screen.getAllByText("Draft")[0]).toBeInTheDocument();
  });

  // --- PESAN REVISI ---
  it("harus menampilkan pesan revisi jika status rejected dan ada obstacles", () => {
    render(
      <EntryList
        entries={[makeEntry({ status: "rejected", obstacles: "Butuh akses server" })]}
        onDelete={mockOnDelete}
      />
    );
    expect(screen.getAllByText(/Revisi: Butuh akses server/)[0]).toBeInTheDocument();
  });

  it("harus TIDAK menampilkan pesan revisi jika status bukan rejected", () => {
    render(
      <EntryList
        entries={[makeEntry({ status: "submitted", obstacles: "Ada kendala" })]}
        onDelete={mockOnDelete}
      />
    );
    expect(screen.queryByText(/Revisi:/)).not.toBeInTheDocument();
  });

  // --- TOMBOL AKSI ---
  it("harus menampilkan tombol Edit & Delete HANYA untuk status draft", () => {
    render(<EntryList entries={[makeEntry({ id: 1, status: "draft" })]} onDelete={mockOnDelete} />);
    // Ada 1 link Edit per view * 2 view = 2 link
    const links = screen.getAllByRole("link");
    expect(links.length).toBe(2);
    // Ada 1 button delete per view * 2 view = 2 button
    const deleteButtons = screen.getAllByText("Hapus");
    expect(deleteButtons.length).toBe(2);
  });

  it("harus menampilkan tombol Edit & Delete HANYA untuk status rejected", () => {
    render(<EntryList entries={[makeEntry({ id: 1, status: "rejected" })]} onDelete={mockOnDelete} />);
    const links = screen.getAllByRole("link");
    expect(links.length).toBe(2); // Edit saja (2 view)
    const deleteButtons = screen.getAllByText("Hapus");
    expect(deleteButtons.length).toBe(2);
  });

  it("harus TIDAK menampilkan tombol Edit & Delete untuk status approved", () => {
    render(<EntryList entries={[makeEntry({ status: "approved" })]} onDelete={mockOnDelete} />);
    // Tidak ada link (View dihapus) dan tidak ada button delete
    expect(screen.queryAllByRole("link").length).toBe(0);
    expect(screen.queryAllByText("Hapus").length).toBe(0);
  });

  it("harus TIDAK menampilkan tombol Edit & Delete untuk status submitted", () => {
    render(<EntryList entries={[makeEntry({ status: "submitted" })]} onDelete={mockOnDelete} />);
    expect(screen.queryAllByRole("link").length).toBe(0);
    expect(screen.queryAllByText("Hapus").length).toBe(0);
  });

  it("harus memanggil onDelete dengan id yang benar saat tombol delete diklik dan dikonfirmasi", async () => {
    render(<EntryList entries={[makeEntry({ id: 42, status: "draft" })]} onDelete={mockOnDelete} />);
    
    // Klik tombol Hapus (ambil yang pertama dari tampilan desktop)
    const deleteButtons = screen.getAllByText("Hapus");
    fireEvent.click(deleteButtons[0]);
    
    // Dialog konfirmasi muncul, cari tombol "Ya, Hapus"
    const confirmButton = await screen.findByRole("button", { name: /ya, hapus/i });
    fireEvent.click(confirmButton);
    
    expect(mockOnDelete).toHaveBeenCalledWith(42);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });
});
