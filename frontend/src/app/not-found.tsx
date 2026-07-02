import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
      <p className="text-gray-600 mb-6">Halaman yang Anda cari tidak ditemukan atau belum dibuat.</p>
      <Link
        href="/login"
        className="px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-blue-800 transition-colors"
      >
        Kembali
      </Link>
    </div>
  );
}