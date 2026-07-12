"use client";

import React from "react";
import { Bell } from "@phosphor-icons/react";

export function NotificationBell() {
  // TODO: Integrasikan dengan useNotificationStore dari Zustand di tahap selanjutnya
  // const { hasUnread } = useNotificationStore();
  const hasUnread = true; // Contoh statis sementara

  return (
    <button 
      className="relative p-2 text-gray-400 hover:text-brand-primary transition-colors rounded-full hover:bg-brand-soft/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
      title="Notifikasi"
    >
      <Bell className="w-6 h-6" weight="regular" />
      {/* Badge merah (indikator pesan belum dibaca) */}
      {hasUnread && (
        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
      )}
    </button>
  );
}