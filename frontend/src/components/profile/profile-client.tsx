"use client";

import { useEffect } from "react";
import { useState } from "react";
import { useProfile } from "@/hooks/use-profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Skeleton from "@/components/ui/skeleton";
import {
  User,
  EnvelopeSimple,
  Lock,
  PencilSimple,
  CalendarBlank,
} from "@phosphor-icons/react";
import { ChangePasswordModal } from "@/components/profile/change-password-modal";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale/id";

const getInitials = (name?: string) => {
  if (!name) return "U";
  const words = name.trim().split(" ");
  if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
  return words[0].substring(0, 2).toUpperCase();
};

export function ProfileClient() {
  const { profile, fetchProfile, isLoading, error } = useProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const roleLabel =
    profile?.role === "mentor" ? "Mentor Pembimbing" : "Mahasiswa Magang";

  const joinedDate = profile?.created_at
    ? format(new Date(profile.created_at), "d MMMM yyyy", { locale: localeId })
    : null;

  // Skeleton loading state
  if (isLoading) {
    return (
      <section className="space-y-8 animate-fade-in-down">
        <div>
          <Skeleton className="h-4 w-32 mb-3" />
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Card>
          <CardContent className="py-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="space-y-2 text-center sm:text-left">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-52" />
                <Skeleton className="h-6 w-36 mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-36" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-44" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="space-y-8 animate-fade-in-down">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400 font-mono">
            Profil Pengguna
          </p>
          <h1 className="mt-2 text-2xl font-bold text-brand-dark font-heading sm:text-3xl">
            Profil Saya
          </h1>
        </div>
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-rose-600 font-medium">{error}</p>
            <Button variant="outline" onClick={fetchProfile} className="mt-4">
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  // Info items
  const infoItems = [
    {
      icon: <User className="w-5 h-5" weight="duotone" />,
      label: "Nama Lengkap",
      value: profile?.name || "-",
    },
    {
      icon: <EnvelopeSimple className="w-5 h-5" weight="duotone" />,
      label: "Email",
      value: profile?.email || "-",
    },
    ...(joinedDate
      ? [
          {
            icon: <CalendarBlank className="w-5 h-5" weight="duotone" />,
            label: "Bergabung Sejak",
            value: joinedDate,
          },
        ]
      : []),
  ];

  return (
    <section className="space-y-8 animate-fade-in-down">
      {/* Header */}
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400 font-mono">
          Profil Pengguna
        </p>
        <h1 className="mt-2 text-2xl font-bold text-brand-dark font-heading sm:text-3xl">
          Profil Saya
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Kelola informasi akun dan keamanan Anda.
        </p>
      </div>

      {/* Avatar Card */}
      <Card>
        <CardContent className="py-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div
              className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-primary to-brand-dark
                flex items-center justify-center text-white text-3xl font-bold font-heading
                shadow-lg shadow-brand-primary/30 shrink-0"
            >
              {getInitials(profile?.name)}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold text-gray-900 font-heading">
                {profile?.name || "-"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {profile?.email || "-"}
              </p>
              <span
                className={cn(
                  "inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold",
                  profile?.role === "mentor"
                    ? "bg-violet-50 text-violet-700 border border-violet-200"
                    : "bg-blue-50 text-brand-primary border border-blue-200"
                )}
              >
                {roleLabel}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Akun</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-gray-100">
          {infoItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
            >
              <div
                className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center
                  text-brand-primary shrink-0"
              >
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 font-medium">
                  {item.label}
                </p>
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {item.value}
                </p>
              </div>
            </div>
          ))}

          {/* Password Row — dengan tombol ubah */}
          <div className="flex items-center gap-4 py-4">
            <div
              className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center
                text-brand-primary shrink-0"
            >
              <Lock className="w-5 h-5" weight="duotone" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 font-medium">Password</p>
              <p className="text-sm font-semibold text-gray-800 tracking-widest">
                ••••••••
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="shrink-0 gap-1.5"
            >
              <PencilSimple className="w-4 h-4" />
              Ubah Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal Change Password */}
      <ChangePasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
