import Link from "next/link";

export default function NotFound() {
  return (
    // Tambahkan font-body agar serasi dengan desain global
    <div className="flex h-screen flex-col items-center justify-center text-center font-body bg-brand-white">
      
      {/* Ganti text-primary menjadi text-brand-primary */}
      <h1 className="text-6xl font-bold text-brand-primary mb-2 font-heading">404</h1>
      
      <p className="text-gray-600 mb-6">Halaman yang Anda cari tidak ditemukan atau belum dibuat.</p>
      
      <Link
        href="/login"
        // Ganti bg-primary menjadi bg-brand-primary, dan hover-nya ke bg-brand-dark
        className="px-6 py-2 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-dark transition-colors"
      >
        Kembali ke Login
      </Link>
      
    </div>
  );
}