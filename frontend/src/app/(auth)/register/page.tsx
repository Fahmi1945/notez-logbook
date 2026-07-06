"use client";

import { useState } from "react";
import Link from "next/link";
import { Envelope, LockSimple, User, UserList } from "@phosphor-icons/react";

// Import komponen UI 
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

// Import API & Messages Constant
import { API_ENDPOINTS } from "@/config/api";
import { MESSAGES } from "@/config/constants";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "", 
    role: "user"
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
      const response = await fetch(`${API_ENDPOINTS.AUTH.REGISTER}`, {
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

    // === ERROR HANDLING FRONTEND ===
      if (!response.ok) {
        alert(data.message || MESSAGES.ERROR.REGISTER_FAILED); // <-- Pakai constant
        setLoading(false);
        return; 
      }

      // === JIKA SUKSES ===
      alert(data.message || MESSAGES.SUCCESS.REGISTER); // <-- Pakai constant
      window.location.href = "/login";
      
    } catch (error) {
      // Menangkap error jaringan
      alert(MESSAGES.ERROR.NETWORK); // <-- Pakai constant
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-8">
      <div className="flex w-full max-w-[800px] bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px]">
        
        {/* KOLOM KIRI */}
        <div className="hidden md:flex flex-col justify-between w-1/2 bg-gradient-to-br from-brand-primary to-brand-dark p-10 text-white relative">
          <div className="absolute -bottom-40 -left-5 w-64 h-64 bg-brand-accent/30 rounded-full blur-[70px] pointer-events-none"></div>

          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/30 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
 
          <div className="relative z-10">
            <h1 className="text-3xl font-heading font-bold leading-snug">
              Mulai Perjalanan<br />Magang Anda!
            </h1>
            <p className="mt-5 mr-18 text-sm text-white/80 leading-relaxed font-body max-w-sm">
              Buat akun NOTEZ. <br />sekarang dan mulailah mengelola logbook magang Anda dengan lebih rapi dan efisien.
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

        {/* KOLOM KANAN */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-white">
          <div className="w-full max-w-sm mx-auto">
            <div className="flex justify-center mb-6">
              <h2 className="text-3xl font-heading font-extrabold text-brand-dark tracking-widest">
                NOTEZ<span className="text-brand-accent">.</span>
              </h2>
            </div>

            {/* FORM MENGGUNAKAN KOMPONEN UI */}
            <form className="space-y-4" onSubmit={handleRegister}>
              
              <Input 
                label="Nama Lengkap"
                type="text"
                placeholder="Budi Santoso"
                required
                icon={<User className="w-5 h-5" weight="regular" />}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />

              <Select 
                label="Pilih Peran"
                icon={<UserList className="w-5 h-5" weight="regular" />}
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                options={[
                  { value: "user", label: "User (Mahasiswa)" },
                  { value: "mentor", label: "Mentor" }
                ]}
              />

              <Input 
                label="Alamat Email"
                type="email"
                placeholder="email@gmail.com"
                required
                icon={<Envelope className="w-5 h-5" weight="regular" />}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />

              <Input 
                label="Password"
                type="password"
                placeholder="••••••••"
                required
                icon={<LockSimple className="w-5 h-5" weight="regular" />}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />

              <Input 
                label="Konfirmasi Password"
                type="password"
                placeholder="••••••••"
                required
                icon={<LockSimple className="w-5 h-5" weight="regular" />}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />

              <Button type="submit" isLoading={loading}>
                Daftar
              </Button>
              
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