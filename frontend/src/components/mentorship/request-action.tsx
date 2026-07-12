"use client";

import React, { useState, useRef } from "react";

interface RequestActionProps {
  onApply: () => Promise<void>; 
}

export function RequestAction({ onApply }: RequestActionProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "pending">("idle");
  
  // INI DIA GEMBOK MUTLAKNYA! Berubah instan dalam 0.0001 detik.
  const isClickedRef = useRef(false);

  const handleClick = async () => {
    // 1. Cek gembok. Kalau sudah diklik, tendang semua klik sisanya!
    if (isClickedRef.current) return; 
    
    // 2. Kunci gembok DETIK INI JUGA! 
    isClickedRef.current = true; 

    // 3. Baru suruh UI berubah perlahan
    setStatus("loading"); 

    try {
      await onApply(); 
      setStatus("pending"); // Kalau sukses, biarkan terkunci
    } catch (error) {
      isClickedRef.current = false; // Kalau gagal API-nya, buka lagi gemboknya
      setStatus("idle");
    }
  };

  if (status === "pending") {
    return (
      <button disabled className="px-4 py-2 rounded-lg text-sm font-semibold transition-all bg-emerald-100 text-emerald-700 cursor-not-allowed">
        Pending
      </button>
    );
  }

  if (status === "loading") {
    return (
      <button disabled className="px-4 py-2 rounded-lg text-sm font-semibold transition-all bg-gray-200 text-gray-400 cursor-not-allowed">
        Mengajukan...
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 rounded-lg text-sm font-semibold transition-all bg-brand-primary text-white hover:bg-brand-dark shadow-sm hover:shadow"
    >
      Ajukan Bimbingan
    </button>
  );
}