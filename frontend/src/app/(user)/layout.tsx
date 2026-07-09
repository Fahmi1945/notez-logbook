"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar"; // Pastikan path ini sesuai dengan file sidebar-mu
import { Navbar } from "@/components/layout/Navbar";
import {Footer} from "@/components/layout/Footer"; // Jika ada Footer, import di sini

export default function UserLayout({ children }: { children: React.ReactNode }) {
  // State untuk mengontrol Sidebar di tampilan Mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-brand-white font-body overflow-hidden">
      
      {/* 1. SIDEBAR AREA */}
      {/* Desktop: Selalu tampil. Mobile: Muncul jika isSidebarOpen true */}
      <div 
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>

      {/* Overlay Gelap untuk Mobile (jika sidebar terbuka, klik luar untuk menutup) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 2 & 3. KANAN: NAVBAR + MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Navbar di atas */}
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Area Main Content (Area yang bisa di-scroll) */}
        <main className="flex-1 overflow-y-auto bg-white">
          {/* Container padding universal agar setiap halaman konsisten */}
          <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
        <Footer />
      </div>

    </div>
  );
}