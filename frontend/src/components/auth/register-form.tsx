"use client";

import { useState } from "react";
import { User, Envelope, LockSimple, UserList } from "@phosphor-icons/react";
import Input from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { registerSchema } from "@/lib/validators/auth.schema";

export default function RegisterForm() {
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user" as "user" | "mentor",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validasi langsung menggunakan skema Zod
    const validation = registerSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0] || "",
        email: fieldErrors.email?.[0] || "",
        role: fieldErrors.role?.[0] || "",
        password: fieldErrors.password?.[0] || "",
        confirmPassword: fieldErrors.confirmPassword?.[0] || "",
      });
      return;
    }

    await register(validation.data);
  };

  return (
    <form className="space-y-3.5" onSubmit={handleSubmit}>
      {/* Input Nama Lengkap */}
      <div>
        <Input
          label="Nama Lengkap"
          type="text"
          placeholder="John Doe"
          icon={<User className="w-5 h-5 text-gray-400" weight="regular" />}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        {errors.name && <p className="text-status-rejected text-[11px] mt-1 font-medium">{errors.name}</p>}
      </div>

      {/* Input Alamat Email */}
      <div>
        <Input
          label="Alamat Email"
          type="email"
          placeholder="email@gmail.com"
          icon={<Envelope className="w-5 h-5 text-gray-400" weight="regular" />}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        {errors.email && <p className="text-status-rejected text-[11px] mt-1 font-medium">{errors.email}</p>}
      </div>

      {/* Pilihan Peran (Role) */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          Peran (Role)
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <UserList className="w-5 h-5 text-brand-primary/70" weight="regular" />
          </div>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as "user" | "mentor" })}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B549A]/20 focus:border-[#2B549A] transition-all appearance-none text-gray-700"
          >
            <option value="user">Mahasiswa (User)</option>
            <option value="mentor">Mentor</option>
          </select>
        </div>
        {errors.role && <p className="text-status-rejected text-[11px] mt-1 font-medium">{errors.role}</p>}
      </div>

      {/* Input Password */}
      <div>
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={<LockSimple className="w-5 h-5 text-gray-400" weight="regular" />}
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        {errors.password && <p className="text-status-rejected text-[11px] mt-1 font-medium">{errors.password}</p>}
      </div>

      {/* Input Konfirmasi Password */}
      <div>
        <Input
          label="Konfirmasi Password"
          type="password"
          placeholder="••••••••"
          icon={<LockSimple className="w-5 h-5 text-gray-400" weight="regular" />}
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        />
        {errors.confirmPassword && <p className="text-status-rejected text-[11px] mt-1 font-medium">{errors.confirmPassword}</p>}
      </div>

      {/* Tombol Submit Aktif Penuh */}
      <Button
        type="submit"
        isLoading={isLoading}
        className="w-full bg-brand-primary hover:bg-brand-dark text-white py-2.5 rounded-lg text-sm font-semibold transition-colors mt-4"
      >
        Daftar Akun
      </Button>
    </form>
  );
}