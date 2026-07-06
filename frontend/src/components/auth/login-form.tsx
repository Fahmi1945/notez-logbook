"use client";

import { useState } from "react";
import Link from "next/link";
import { Envelope, LockSimple } from "@phosphor-icons/react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Captcha from "@/components/auth/captcha";
import { useAuth } from "@/hooks/use-auth";
import { loginSchema } from "@/lib/validators/auth.schema";

export default function LoginForm() {
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  
  // 2. Tambahkan state untuk Captcha
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; captcha?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); 

    // 3. Cek validasi Captcha terlebih dahulu
    if (!isCaptchaValid) {
      setErrors((prev) => ({ ...prev, captcha: "Silakan hitung keamanan dengan benar." }));
      return;
    }

    const validation = loginSchema.safeParse(formData);
    
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return; 
    }

    await login(validation.data);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <Input
          label="Alamat Email"
          type="email"
          placeholder="email@gmail.com"
          icon={<Envelope className="w-5 h-5 text-gray-400" weight="regular" />}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        {errors.email && <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.email}</p>}
      </div>

      <div>
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={<LockSimple className="w-5 h-5 text-gray-400" weight="regular" />}
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        {errors.password && <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.password}</p>}
        
      </div>

      {/* 4. Letakkan Captcha sebelum tombol Submit */}
      <div>
        <Captcha onValidate={(isValid) => setIsCaptchaValid(isValid)} />
        {errors.captcha && <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.captcha}</p>}
      </div>
      <div className="flex justify-end mt-2">
        <Link href="/forgot-password" className="text-[11px] font-bold text-brand-primary hover:underline">
        Lupa password?
        </Link>
      </div>

      <Button 
        type="submit" 
        isLoading={isLoading}
        // Tombol sedikit redup jika captcha belum valid
        className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors mt-2 ${
          isCaptchaValid 
            ? "bg-brand-primary hover:bg-brand-dark text-white" 
            : "bg-brand-primary/70 text-white/80 cursor-not-allowed"
        }`}
      >
        Masuk
      </Button>
    </form>
  );
}