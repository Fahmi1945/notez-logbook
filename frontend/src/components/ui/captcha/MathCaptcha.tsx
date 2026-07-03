"use client";

import { useState, useEffect } from "react";
import { Calculator } from "@phosphor-icons/react";

interface MathCaptchaProps {
  onValidate: (isValid: boolean) => void;
}

export default function MathCaptcha({ onValidate }: MathCaptchaProps) {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // Menggunakan useEffect agar angka acak hanya di-generate di sisi client
  // (Mencegah error Hydration Mismatch bawaan Next.js)
  useEffect(() => {
    setNum1(Math.floor(Math.random() * 10) + 1); // Angka 1-10
    setNum2(Math.floor(Math.random() * 10) + 1); // Angka 1-10
    setIsMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAnswer(val);
    
    // Validasi apakah jawaban user sama dengan hasil penjumlahan
    const isValid = parseInt(val) === num1 + num2;
    onValidate(isValid);
  };

  // Mencegah render sebelum angka siap
  if (!isMounted) return null; 

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-700 block">
        Verifikasi (Berapa {num1} + {num2}?)
      </label>
      <div className="relative flex items-center">
        <Calculator className="absolute left-3.5 w-5 h-5 text-gray-400" weight="regular" />
        <input
          type="number"
          value={answer}
          onChange={handleChange}
          placeholder="Masukkan hasil"
          className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all placeholder:text-gray-400 text-gray-800"
          required
        />
      </div>
    </div>
  );
}