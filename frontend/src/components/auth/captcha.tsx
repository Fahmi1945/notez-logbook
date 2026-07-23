"use client";

import { useState, useEffect } from "react";
import Input from "@/components/ui/input";
import { Calculator, ArrowsClockwise } from "@phosphor-icons/react";

interface CaptchaProps {
  onValidate: (isValid: boolean) => void;
}

export default function Captcha({ onValidate }: CaptchaProps) {
  // 1. Berikan nilai awal statis (misal 0) untuk menghindari mismatch saat SSR
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [answer, setAnswer] = useState("");
  
  // 2. State untuk mendeteksi apakah komponen sudah berada di browser
  const [isMounted, setIsMounted] = useState(false);

  // 3. Generate angka HANYA setelah komponen di-mount di client (browser)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
    setIsMounted(true);
  }, []);

  const generateNumbers = () => {
    const n1 = Math.floor(Math.random() * 10) + 1;
    const n2 = Math.floor(Math.random() * 10) + 1;
    setNum1(n1);
    setNum2(n2);
    setAnswer("");
    onValidate(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAnswer(val);
    
    // Validasi apakah jawaban sesuai
    if (parseInt(val) === num1 + num2) {
      onValidate(true);
    } else {
      onValidate(false);
    }
  };

  // 4. Tampilkan fallback UI saat proses SSR berjalan agar tidak terjadi mismatch
  if (!isMounted) {
    return (
      <div className="flex gap-2 items-end h-[68px] opacity-50">
        <div className="flex-1 flex items-center px-3 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-500">
          Memuat keamanan...
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 items-end">
      <div className="flex-1">
        <Input
          label={`Keamanan: Berapa ${num1} + ${num2}?`}
          type="number"
          placeholder="Jawaban..."
          value={answer}
          onChange={handleChange}
          icon={<Calculator className="w-5 h-5 text-gray-400" weight="regular" />}
        />
      </div>
      <button
        type="button"
        onClick={generateNumbers}
        className="px-3 py-2.5 h-10.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-sm transition-colors border border-gray-200 flex items-center justify-center"
        title="Ganti angka"
      >
        <ArrowsClockwise className="w-5 h-5" weight="bold" />
      </button>
    </div>
  );
}