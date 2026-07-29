"use client";

import { User, Envelope, LockSimple, UserList } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import FormField from "@/components/auth/form-field";
import { useAuth } from "@/hooks/use-auth";
import { registerSchema, RegisterInput } from "@/lib/validators/auth.schema";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function RegisterForm() {
  const { register: registerAuth, isLoading } = useAuth();
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "user",
    }
  });

  const onSubmit = async (data: RegisterInput) => {
    await registerAuth(data);
  };

  return (
    <form className="space-y-3.5" onSubmit={handleSubmit(onSubmit)}>
      <FormField
        label="Nama Lengkap"
        type="text"
        placeholder="John Doe"
        icon={<User className="w-5 h-5 text-gray-400" weight="regular" />}
        error={errors.name?.message}
        {...register("name")}
      />

      <FormField
        label="Alamat Email"
        type="email"
        placeholder="email@gmail.com"
        icon={<Envelope className="w-5 h-5 text-gray-400" weight="regular" />}
        error={errors.email?.message}
        {...register("email")}
      />

      {/* Pilihan Peran (Role) */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          Peran (Role)
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <UserList className="w-5 h-5 text-brand-primary/70" weight="regular" />
          </div>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B549A]/20 focus:border-[#2B549A] transition-all appearance-none text-gray-700"
              >
                <option value="user">Mahasiswa (User)</option>
                <option value="mentor">Mentor</option>
              </select>
            )}
          />
        </div>
        {errors.role && (
          <p className="text-status-rejected text-[11px] mt-1 font-medium">{errors.role.message}</p>
        )}
      </div>

      <FormField
        label="Password"
        type="password"
        placeholder="••••••••"
        icon={<LockSimple className="w-5 h-5 text-gray-400" weight="regular" />}
        error={errors.password?.message}
        {...register("password")}
      />

      <FormField
        label="Konfirmasi Password"
        type="password"
        placeholder="••••••••"
        icon={<LockSimple className="w-5 h-5 text-gray-400" weight="regular" />}
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

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