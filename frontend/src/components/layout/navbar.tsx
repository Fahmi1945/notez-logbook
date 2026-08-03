"use client";

import React from "react";
import { List } from "@phosphor-icons/react";
import { useAuth } from "@/hooks/use-auth";
import { NotificationBell } from "@/components/layout/notification-bell";

export function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm h-[72px] flex items-center justify-between px-4 sm:px-6 z-10">
      {/* Kiri: Tombol Hamburger (Hanya terlihat di Mobile) */}
      <div className="flex items-center">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 mr-2 md:hidden text-gray-500 hover:text-brand-primary hover:bg-gray-50 rounded-lg transition-colors"
        >
          <List className="w-6 h-6" />
        </button>
        
        {/* Opsional: Judul Halaman Dinamis atau Breadcrumb bisa ditaruh di sini nantinya */}
        <h1 className="text-lg font-bold font-heading text-brand-dark hidden sm:block">
          Selamat datang, {user?.name?.split(" ")[0] || "Memuat"}!
        </h1>
      </div>

      {/* Kanan: Notifikasi & Profil Singkat */}
      <div className="flex items-center gap-4">
        {/* Ikon Notifikasi */}
        <NotificationBell />

        {/* Garis Pemisah */}
        <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

        {/* Profil Singkat Navbar */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-brand-dark leading-tight">{user?.name || "Memuat..."}</p>
            <p className="text-xs text-gray-500">{user?.role === "mentor" ? "Mentor" : "Mahasiswa"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}