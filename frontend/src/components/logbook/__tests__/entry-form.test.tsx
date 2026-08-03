import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EntryForm from "../entry-form";
import { EntryFormInput } from "@/lib/validators/entry.schema";

// Mock next/navigation agar tidak error di jsdom
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    back: jest.fn(),
    push: jest.fn(),
  }),
}));

// Mock komponen UI yang tidak perlu diuji di sini
jest.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, type, disabled, isLoading }: {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    isLoading?: boolean;
  }) => (
    <button type={type} onClick={onClick} disabled={disabled || isLoading}>
      {isLoading && <span data-testid="spinner">Loading...</span>}
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/spinner", () => ({
  Spinner: () => <span data-testid="spinner">Loading...</span>,
}));

const fillForm = (overrides: Partial<{ title: string; description: string; obstacles: string }> = {}) => {
  const titleInput = screen.getByLabelText(/Judul Kegiatan/i);
  const descInput = screen.getByLabelText(/Deskripsi Pekerjaan/i);

  fireEvent.change(titleInput, {
    target: { value: overrides.title ?? "Implementasi Fitur Login" },
  });
  fireEvent.change(descInput, {
    target: { value: overrides.description ?? "Membuat halaman login dengan validasi Zod dan testing." },
  });

  if (overrides.obstacles !== undefined) {
    const obstaclesInput = screen.getByLabelText(/Hambatan/i);
    fireEvent.change(obstaclesInput, { target: { value: overrides.obstacles } });
  }
};

describe("EntryForm", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => mockOnSubmit.mockClear());

  // --- RENDER AWAL ---
  it("harus merender semua field form", () => {
    render(<EntryForm onSave={mockOnSubmit} isSaving={false} />);
    expect(screen.getByLabelText(/Tanggal Kegiatan/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Judul Kegiatan/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Deskripsi Pekerjaan/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Hambatan/i)).toBeInTheDocument();
  });

  it("harus pre-fill field jika initialData diberikan (mode Edit)", () => {
    const initialData: EntryFormInput = {
      activity_date: "2024-07-22",
      title: "Review Code Sprint 3",
      description: "Melakukan code review untuk fitur mentorship.",
      obstacles: "Tidak ada hambatan",
    };
    render(<EntryForm initialData={initialData} onSave={mockOnSubmit} isSaving={false} />);
    expect(screen.getByDisplayValue("Review Code Sprint 3")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Melakukan code review untuk fitur mentorship.")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Tidak ada hambatan")).toBeInTheDocument();
  });

  it("harus menampilkan tombol 'Simpan Draft'", () => {
    render(<EntryForm onSave={mockOnSubmit} isSaving={false} />);
    expect(screen.getByText("Simpan Draft")).toBeInTheDocument();
  });

  it("harus menampilkan Spinner dan disable tombol saat isLoading=true", () => {
    render(<EntryForm onSave={mockOnSubmit} isSaving={true} />);
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => expect(btn).toBeDisabled());
  });

  // --- VALIDASI FORM ---
  it("harus menampilkan error jika title kosong saat submit", async () => {
    render(<EntryForm onSave={mockOnSubmit} isSaving={false} />);
    // Langsung klik tombol submit tanpa mengisi title
    fireEvent.click(screen.getByText("Simpan Draft"));
    await waitFor(() => {
      expect(screen.getByText(/Judul kegiatan wajib diisi|Judul minimal 5 karakter/i)).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("harus menampilkan error jika title kurang dari 5 karakter", async () => {
    render(<EntryForm onSave={mockOnSubmit} isSaving={false} />);
    // Isi description valid, biarkan title pendek
    fillForm({ title: "API", description: "Deskripsi yang cukup panjang untuk lolos validasi" });
    fireEvent.click(screen.getByText("Simpan Draft"));
    await waitFor(() => {
      expect(screen.getByText("Judul minimal 5 karakter")).toBeInTheDocument();
    });
  });

  it("harus menampilkan error jika description kosong saat submit", async () => {
    render(<EntryForm onSave={mockOnSubmit} isSaving={false} />);
    // Isi title valid, kosongkan description
    fillForm({ title: "Judul Valid", description: "" });
    fireEvent.click(screen.getByText("Simpan Draft"));
    await waitFor(() => {
      expect(
        screen.getByText(/Deskripsi pekerjaan wajib diisi|Deskripsi minimal 10 karakter/i)
      ).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  // --- SUBMIT BERHASIL ---
  it("harus memanggil onSubmit dengan data yang benar jika form valid", async () => {
    mockOnSubmit.mockResolvedValue(undefined);
    render(<EntryForm onSave={mockOnSubmit} isSaving={false} />);
    fillForm();
    fireEvent.submit(document.querySelector("form")!);
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Implementasi Fitur Login",
        description: "Membuat halaman login dengan validasi Zod dan testing.",
      }),
      []
    );
  });

  // --- ERROR DARI SERVER ---
  it("harus menampilkan errorMsg jika onSubmit throw error", async () => {
    mockOnSubmit.mockRejectedValue(new Error("Gagal menyimpan ke server"));
    render(<EntryForm onSave={mockOnSubmit} isSaving={false} />);
    fillForm();
    fireEvent.submit(document.querySelector("form")!);
    await waitFor(() => {
      expect(screen.getByText("Gagal menyimpan ke server")).toBeInTheDocument();
    });
  });
});
