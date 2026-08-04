"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  House, 
  BookBookmark, 
  UsersThree, 
  SquaresFour, 
  BookOpen, 
  Users, 
  UserCircle,
  SignOut 
} from "@phosphor-icons/react";
import { useAuthStore } from "@/store/auth-store"; // Gunakan Zustand untuk cek role

// Pembuat inisial 2 huruf untuk Avatar
const getInitials = (name?: string) => {
  if (!name) return "U";
  const words = name.trim().split(" ");
  if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
  return words[0].substring(0, 2).toUpperCase();
};

export function Sidebar() { // Ubah nama menjadi Sidebar (umum)
  const pathname = usePathname();
  const { user, logout } = useAuthStore(); // Ambil user dan fungsi logout

  const handleLogout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    logout();
    window.location.href = "/login";
  };

  // 1. Menu Khusus MAHASISWA (User)
  const USER_LINKS = [
    { name: "Dashboard", href: "/dashboard", icon: House },
    { name: "Logbook Saya", href: "/logbook", icon: BookBookmark },
    { name: "Mentorship", href: "/mentorship", icon: UsersThree },
    { name: "Profil Saya", href: "/profile", icon: UserCircle },
  ];

  // 2. Menu Khusus MENTOR 
  const MENTOR_LINKS = [
    { name: "Dashboard", href: "/mentor/dashboard", icon: SquaresFour },
    { name: "Review Logbook", href: "/mentor/review", icon: BookOpen },
    { name: "Daftar Mahasiswa", href: "/mentor/students", icon: Users },
    { name: "Profil Saya", href: "/mentor/profile", icon: UserCircle },
  ];

  // 3. LOGIKA PENENTU: Cek role, lalu pilih daftar menu yang tepat
  const navLinks = user?.role === "mentor" ? MENTOR_LINKS : USER_LINKS;
  const roleLabel = user?.role === "mentor" ? "Mentor Pembimbing" : "Mahasiswa Magang";

  return (
    <aside className="flex flex-col w-64 bg-linear-to-br from-brand-primary to-brand-dark text-white relative shadow-xl z-20 h-full">
      {/* Dekorasi Pojok Kanan Atas (Sesuai UI) */}
      <div className="absolute -top-11 -right-5 w-32 h-32 bg-white/5 rounded-bl-[100px] 
      pointer-events-none"></div>

      {/* Logo */}
      <div className="pt-6 pb-10 flex items-center justify-center relative z-10">
        <h2 className="text-3xl font-bold font-heading tracking-wide">
          NOTEZ<span className="text-brand-accent">.</span>
        </h2>
      </div>

      {/* List Menu */}
      <nav className="flex-1 px-4 space-y-4 mt-2 overflow-y-auto relative z-10">
        {navLinks.map((link) => {
          const isActive = pathname?.startsWith(link.href);
          const Icon = link.icon;
          
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-medium ${
                isActive 
                  ? "bg-white/10 text-brand-accent shadow-inner" 
                  : "text-white/80 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" weight={isActive ? "fill" : "regular"} />
              <span className="text-sm tracking-wide">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Profil & Logout */}
      <div className="border-t border-white/10 p-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-brand-primary flex items-center justify-center font-bold text-sm shrink-0">
              {getInitials(user?.name)}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold text-white truncate">
                {user?.name || "Memuat..."}
              </span>
              <span className="text-[11px] text-white/60 truncate">
                {roleLabel} {/* Label otomatis berubah */}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors shrink-0"
            title="Keluar"
          >
            <SignOut className="w-5 h-5" weight="regular" />
          </button>
        </div>
      </div>
    </aside>
  );
}