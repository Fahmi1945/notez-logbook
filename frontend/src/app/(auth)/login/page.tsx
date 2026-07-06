import Link from "next/link";
import LoginForm from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-gray-50 font-sans">
      {/* Container utama diperlebar sedikit agar proporsional seperti desain */}
      <div className="flex w-full max-w-[800px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden min-h-[550px]">
        
        {/* KOLOM KIRI - Branding UI */}
        <div className="hidden md:flex flex-col justify-between w-1/2 bg-[#2B549A] p-10 text-white relative overflow-hidden">
          {/* Efek blur lingkaran di pojok kiri bawah */}
          <div className="absolute -bottom-40 -left-5 w-64 h-64 bg-brand-accent/30 rounded-full blur-[70px] pointer-events-none"></div>

          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/30 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 mt-5">
            <h1 className="text-[2rem] font-bold leading-[1.3] tracking-tight mb-4">
              Kelola Logbook<br />Magang Anda<br />dengan Mudah.
            </h1>
            <p className="mt-5 mr-18 text-sm text-white/80 leading-relaxed font-body max-w-sm">
              Bergabunglah dengan NOTEZ. <br/> untuk melacak progres, mendapatkan review dari mentor, dan mengorganisir aktivitas harian Anda.
            </p>
          </div>

          {/* Footer Kiri: Avatars & Teks */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-[#F59E0B] flex items-center justify-center text-[10px] font-bold border-2 border-[#2B549A]">BS</div>
              <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold border-2 border-[#2B549A]">FA</div>
            </div>
            <span className="text-xs font-medium text-white/90 tracking-wide">
              Digunakan oleh +1.000 Mahasiswa
            </span>
          </div>
        </div>

        {/* KOLOM KANAN - Area Form */}
        <div className="w-full md:w-1/2 px-10 py-12 flex flex-col justify-center bg-white">
          <div className="w-full max-w-sm mx-auto">
            
            {/* Logo Tengah Atas */}
            <div className="flex justify-center mb-8">
              <h2 className="text-3xl font-extrabold text-[#2B549A] tracking-widest">
                NOTEZ<span className="text-[#F59E0B]">.</span>
              </h2>
            </div>

            {/* Sapaan Teks */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Selamat Datang Kembali!</h3>
              <p className="text-[13px] text-gray-500">Silakan masukkan detail akun Anda untuk masuk.</p>
            </div>

            {/* Panggil Komponen Form Pekerja */}
            <LoginForm />

            {/* Link Daftar */}
            <p className="text-center text-xs text-gray-500 mt-8">
              Belum punya akun?{" "}
              <Link href="/register" className="font-bold text-[#F59E0B] hover:text-orange-600 transition-colors">
                Daftar di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}