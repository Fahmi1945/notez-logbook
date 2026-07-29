"use client";

import { useState } from "react";
import { Envelope, LockSimple } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import Captcha from "@/components/auth/captcha";
import FormField from "@/components/auth/form-field";
import { useAuth } from "@/hooks/use-auth";
import { loginSchema, LoginInput } from "@/lib/validators/auth.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function LoginForm() {
  const { login, isLoading } = useAuth();
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [captchaError, setCaptchaError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    if (!isCaptchaValid) {
      setCaptchaError("Silakan hitung keamanan dengan benar.");
      return;
    }
    setCaptchaError(null);
    await login(data);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <FormField
        label="Alamat Email"
        type="email"
        placeholder="email@gmail.com"
        icon={<Envelope className="w-5 h-5 text-gray-400" weight="regular" />}
        error={errors.email?.message}
        {...register("email")}
      />

      <FormField
        label="Password"
        type="password"
        placeholder="••••••••"
        icon={<LockSimple className="w-5 h-5 text-gray-400" weight="regular" />}
        error={errors.password?.message}
        {...register("password")}
      />

      {/* Captcha diletakkan sebelum tombol Submit */}
      <div>
        <Captcha
          onValidate={(isValid) => {
            setIsCaptchaValid(isValid);
            if (isValid) setCaptchaError(null);
          }}
        />
        {captchaError && (
          <p className="text-status-rejected text-[11px] mt-1 font-medium">{captchaError}</p>
        )}
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