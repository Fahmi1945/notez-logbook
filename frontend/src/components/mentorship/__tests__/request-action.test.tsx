import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { RequestAction } from "../request-action";

describe("RequestAction", () => {
  it("harus menampilkan tombol 'Ajukan Bimbingan' di awal (status idle)", () => {
    render(<RequestAction onApply={jest.fn()} />);
    expect(screen.getByText("Ajukan Bimbingan")).toBeInTheDocument();
  });

  it("harus menampilkan 'Mengajukan...' saat onApply sedang berjalan", async () => {
    // onApply yang tidak pernah selesai (Promise yang pending selamanya)
    const neverResolve = () => new Promise<void>(() => {});

    render(<RequestAction onApply={neverResolve} />);
    fireEvent.click(screen.getByText("Ajukan Bimbingan"));

    await waitFor(() => {
      expect(screen.getByText("Mengajukan...")).toBeInTheDocument();
    });
  });

  it("harus menampilkan 'Pending' setelah onApply berhasil", async () => {
    const mockOnApply = jest.fn().mockResolvedValue(undefined);

    render(<RequestAction onApply={mockOnApply} />);

    await act(async () => {
      fireEvent.click(screen.getByText("Ajukan Bimbingan"));
    });

    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(mockOnApply).toHaveBeenCalledTimes(1);
  });

  it("tombol 'Pending' harus disabled dan tidak bisa diklik", async () => {
    const mockOnApply = jest.fn().mockResolvedValue(undefined);
    render(<RequestAction onApply={mockOnApply} />);

    await act(async () => {
      fireEvent.click(screen.getByText("Ajukan Bimbingan"));
    });

    const pendingBtn = screen.getByText("Pending");
    expect(pendingBtn).toBeDisabled();
  });

  it("harus kembali ke 'Ajukan Bimbingan' jika onApply gagal (error)", async () => {
    const mockOnApply = jest.fn().mockRejectedValue(new Error("Server error"));

    render(<RequestAction onApply={mockOnApply} />);

    await act(async () => {
      fireEvent.click(screen.getByText("Ajukan Bimbingan"));
    });

    expect(screen.getByText("Ajukan Bimbingan")).toBeInTheDocument();
  });

  it("harus mencegah double-click (hanya panggil onApply sekali)", async () => {
    // onApply lambat (simulasi jaringan)
    const slowApply = jest.fn(
      () => new Promise<void>((resolve) => setTimeout(resolve, 500))
    );

    render(<RequestAction onApply={slowApply} />);
    const btn = screen.getByText("Ajukan Bimbingan");

    // Klik dua kali berturut-turut
    fireEvent.click(btn);
    fireEvent.click(btn);
    fireEvent.click(btn);

    // onApply hanya boleh terpanggil 1 kali
    expect(slowApply).toHaveBeenCalledTimes(1);
  });
});
