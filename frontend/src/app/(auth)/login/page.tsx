"use client";

import { useState } from "react";
import Link from "next/link";
import { Envelope, LockSimple } from "@phosphor-icons/react";
import MathCaptcha from "@/components/ui/captcha/MathCaptcha";

export default function LoginPage() {
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-8">
      {/* Container Card Utama */}
      <div className="flex w-full max-w-[800px] bg-white rounded-2xl shadow-xl overflow-hidden min-h-[550px]">
        
        {/* KOLOM KIRI - Branding & Informasi (Sembunyi di layar kecil) */}
        <div className="hidden md:flex flex-col justify-between w-1/2 bg-gradient-to-br from-brand-primary to-brand-dark p-10 text-white relative">

          <div className="absolute -bottom-40 -left-5 w-64 h-64 bg-brand-accent/30 rounded-full blur-[70px] pointer-events-none"></div>


          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-heading font-bold leading-snug">
              Kelola Logbook<br />Magang Anda<br />dengan Mudah.
            </h1>
            <p className="mt-5 mr-18 text-sm text-white/80 leading-relaxed font-body max-w-sm">
              Bergabunglah dengan NOTEZ. untuk melacak progres, mendapatkan review dari mentor, dan mengorganisir aktivitas harian Anda.
            </p>
          </div>

          {/* Bagian Testimonial/User Info */}
          <div className="flex items-center space-x-3 relative z-10">
            <div className="flex">
              <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center text-xs font-bold border-2 border-brand-primary shadow-sm">
                BS
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold border-2 border-brand-primary -ml-2 shadow-sm">
                FA
              </div>
            </div>
            <span className="text-xs font-medium text-white/90">
              Digunakan oleh +1.000 Mahasiswa
            </span>
          </div>
        </div>

        {/* KOLOM KANAN - Form Login */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-white">
          <div className="w-full max-w-sm mx-auto">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <h2 className="text-3xl font-heading font-extrabold text-brand-dark tracking-widest">
                NOTEZ<span className="text-brand-accent">.</span>
              </h2>
            </div>

            {/* Header Text */}
            <div className="mb-6">
              <h3 className="text-xl font-heading font-extrabold text-gray-800">
                Selamat Datang Kembali!
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Silakan masukkan detail akun Anda untuk masuk.
              </p>
            </div>

            {/* Form Input */}
            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault(); // Mencegah reload halaman
              
              if (!isCaptchaValid) {
                alert("Captcha salah! Mohon isi kembali dengan benar.");
              } else {
                alert("Captcha benar! Proses login..."); // Atau jalankan fungsi loginmu di sini
              }
            }}>
              {/* Input Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 block">
                  Alamat Email
                </label>
                <div className="relative flex items-center">
                  <Envelope className="absolute left-3.5 w-5 h-5 text-gray-400" weight="regular" />
                  <input
                    type="email"
                    placeholder="email@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all placeholder:text-gray-400 text-gray-800"
                    required
                  />
                </div>
              </div>

              {/* Input Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 block">
                  Password
                </label>
                <div className="relative flex items-center">
                  <LockSimple className="absolute left-3.5 w-5 h-5 text-gray-400" weight="regular" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all placeholder:text-gray-400 text-gray-800"
                    required
                  />
                </div>
              </div>
              <MathCaptcha onValidate={(isValid) => setIsCaptchaValid(isValid)} />
              {/* Lupa Password */}
              <div className="flex justify-end pt-1">
                <a href="#" className="text-xs font-semibold text-brand-primary hover:text-brand-dark transition-colors">
                  Lupa password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-primary text-white py-2.5 rounded-lg text-sm font-bold hover:bg-brand-dark transition-colors shadow-md shadow-brand-primary/30 mt-2"
              >
                Masuk
              </button>
            </form>

            {/* Link Daftar */}
            <p className="text-center text-xs text-gray-600 mt-6">
              Belum punya akun?{" "}
              <Link href="/register" className="font-bold text-brand-accent hover:text-orange-500 transition-colors">
                Daftar di sini
              </Link>
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}