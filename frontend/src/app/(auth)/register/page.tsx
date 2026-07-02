"use client";

import { useState } from "react";
import Link from "next/link";
import { Envelope, LockSimple, User, UserList } from "@phosphor-icons/react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "", 
    role: "user" // Pastikan default role sudah ada di state
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Password tidak cocok!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://100.125.27.63:3333/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Mengirimkan role ke API
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Pendaftaran berhasil! Silakan login.");
        window.location.href = "/login";
      } else {
        alert(data.message || "Gagal mendaftar");
      }
    } catch (error) {
      alert("Terjadi kesalahan koneksi ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-8">
      <div className="flex w-full max-w-[800px] bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px]">
        
        {/* KOLOM KIRI */}
        <div className="hidden md:flex flex-col justify-between w-1/2 bg-gradient-to-br from-brand-primary to-brand-dark p-10 text-white relative">
          <div className="absolute -bottom-40 -left-5 w-64 h-64 bg-brand-accent/30 rounded-full blur-[70px] pointer-events-none"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-heading font-bold leading-snug">
              Mulai Perjalanan<br />Magang Anda!
            </h1>
            <p className="mt-5 text-sm text-white/80 leading-relaxed font-body max-w-sm">
              Buat akun NOTEZ. sekarang dan mulailah mengelola logbook magang Anda dengan lebih rapi dan efisien.
            </p>
          </div>
        </div>

        {/* KOLOM KANAN */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-white">
          <div className="w-full max-w-sm mx-auto">
            <div className="flex justify-center mb-6">
              <h2 className="text-3xl font-heading font-extrabold text-brand-dark tracking-widest">
                NOTEZ<span className="text-brand-accent">.</span>
              </h2>
            </div>

            <form className="space-y-4" onSubmit={handleRegister}>
              {/* Nama Lengkap */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 block">Nama Lengkap</label>
                <div className="relative flex items-center">
                  <User className="absolute left-3.5 w-5 h-5 text-gray-400" weight="regular" />
                  <input type="text" placeholder="Budi Santoso" className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none" required onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
              </div>

              {/* INPUT ROLE DITAMBAHKAN DI SINI */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 block">Pilih Peran</label>
                <div className="relative flex items-center">
                  <UserList className="absolute left-3.5 w-5 h-5 text-gray-400" weight="regular" />
                  <select 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none appearance-none"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="user">User (Mahasiswa)</option>
                    <option value="mentor">Mentor</option>
                  </select>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 block">Alamat Email</label>
                <div className="relative flex items-center">
                  <Envelope className="absolute left-3.5 w-5 h-5 text-gray-400" weight="regular" />
                  <input type="email" placeholder="email@gmail.com" className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none" required onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 block">Password</label>
                <div className="relative flex items-center">
                  <LockSimple className="absolute left-3.5 w-5 h-5 text-gray-400" weight="regular" />
                  <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none" required onChange={(e) => setFormData({...formData, password: e.target.value})} />
                </div>
              </div>

              {/* Konfirmasi Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 block">Konfirmasi Password</label>
                <div className="relative flex items-center">
                  <LockSimple className="absolute left-3.5 w-5 h-5 text-gray-400" weight="regular" />
                  <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none" required onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2.5 rounded-lg text-sm font-bold transition-colors shadow-md mt-2 
                  ${loading ? "bg-gray-400" : "bg-brand-primary hover:bg-brand-dark"} text-white`}
              >
                {loading ? "Memproses..." : "Daftar"}
              </button>
            </form>

            <p className="text-center text-xs text-gray-600 mt-6">
              Sudah punya akun?{" "}
              <Link href="/login" className="font-bold text-brand-accent hover:text-orange-500 transition-colors">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}