"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

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
    } catch {
      isClickedRef.current = false; // Kalau gagal API-nya, buka lagi gemboknya
      setStatus("idle");
    }
  };

  if (status === "pending") {
    return (
      <Button disabled variant="success" className="cursor-not-allowed">
        Pending
      </Button>
    );
  }

  if (status === "loading") {
    return (
      <Button disabled isLoading variant="primary" className="cursor-not-allowed">
        Mengajukan...
      </Button>
    );
  }

  return (
    <Button onClick={handleClick} variant="primary">
      Ajukan Bimbingan
    </Button>
  );
}