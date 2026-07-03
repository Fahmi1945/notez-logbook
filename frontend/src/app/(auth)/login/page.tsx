"use client";

import { useState } from "react";
import Link from "next/link";
import { Envelope, LockSimple } from "@phosphor-icons/react";
import MathCaptcha from "@/components/ui/captcha/MathCaptcha";

export default function LoginPage() {
  // 1. State role dihapus dari formData
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isCaptchaValid) {
      alert("Captcha salah! Mohon isi kembali dengan benar.");
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Hanya mengirim email dan password
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 2. Mengambil role dari balasan server (data.role)
        const userRole = data.role; // Pastikan backend mengirim parameter 'role'
        
        alert(`Login berhasil!`);
        
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        // 3. Routing otomatis berdasarkan role dari database
        if (userRole === "mentor") {
          window.location.href = "/dashboard/mentor";
        } else {
          // Default diarahkan ke user
          window.location.href = "/dashboard/user";
        }
      } else {
        alert(data.message || "Email atau password salah.");
      }
    } catch (error) {
      alert("Terjadi kesalahan koneksi ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-8">
      <div className="flex w-full max-w-[800px] bg-white rounded-2xl shadow-xl overflow-hidden min-h-[550px]">
        
        {/* KOLOM KIRI - Tetap sama persis */}
        <div className="hidden md:flex flex-col justify-between w-1/2 bg-gradient-to-br from-brand-primary to-brand-dark p-10 text-white relative">
          <div className="absolute -bottom-40 -left-5 w-64 h-64 bg-brand-accent/30 rounded-full blur-[70px] pointer-events-none"></div>
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/30 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-heading font-bold leading-snug">
              Kelola Logbook<br />Magang Anda<br />dengan Mudah.
            </h1>
            <p className="mt-5 mr-18 text-sm text-white/80 leading-relaxed font-body max-w-sm">
              Bergabunglah dengan NOTEZ.<br /> untuk melacak progres, mendapatkan review dari mentor, dan mengorganisir aktivitas harian Anda.
            </p>
          </div>

          <div className="flex items-center space-x-3 relative z-10">
            <div className="flex">
              <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center text-xs font-bold border-2 border-brand-primary shadow-sm">BS</div>
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold border-2 border-brand-primary -ml-2 shadow-sm">FA</div>
            </div>
            <span className="text-xs font-medium text-white/90">Digunakan oleh +1.000 Mahasiswa</span>
          </div>
        </div>

        {/* KOLOM KANAN - Form Login */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-white">
          <div className="w-full max-w-sm mx-auto">
            <div className="flex justify-center mb-8">
              <h2 className="text-3xl font-heading font-extrabold text-brand-dark tracking-widest">
                NOTEZ<span className="text-brand-accent">.</span>
              </h2>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-heading font-extrabold text-gray-800">Selamat Datang Kembali!</h3>
              <p className="text-xs text-gray-500 mt-1">Silakan masukkan detail akun Anda untuk masuk.</p>
            </div>

            <form className="space-y-4" onSubmit={handleLogin}>
              
              {/* Input Pilihan Role Dihapus dari sini */}

              {/* Input Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 block">Alamat Email</label>
                <div className="relative flex items-center">
                  <Envelope className="absolute left-3.5 w-5 h-5 text-gray-400" weight="regular" />
                  <input
                    type="email"
                    placeholder="email@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all placeholder:text-gray-400 text-gray-800"
                    required
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              {/* Input Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 block">Password</label>
                <div className="relative flex items-center">
                  <LockSimple className="absolute left-3.5 w-5 h-5 text-gray-400" weight="regular" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all placeholder:text-gray-400 text-gray-800"
                    required
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              {/* Captcha Aritmatika */}
              <MathCaptcha onValidate={(isValid) => setIsCaptchaValid(isValid)} />

              {/* Tombol Masuk */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2.5 rounded-lg text-sm font-bold transition-colors shadow-md mt-2 text-white
                  ${loading ? "bg-gray-400 cursor-wait" : "bg-brand-primary hover:bg-brand-dark shadow-brand-primary/30"}`}
              >
                {loading ? "Memproses..." : "Masuk"}
              </button>
            </form>

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