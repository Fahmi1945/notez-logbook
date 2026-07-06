"use client";

import { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import { Calculator, ArrowsClockwise } from "@phosphor-icons/react";

interface CaptchaProps {
  onValidate: (isValid: boolean) => void;
}

export default function Captcha({ onValidate }: CaptchaProps) {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [answer, setAnswer] = useState("");

  const generateNumbers = () => {
    const n1 = Math.floor(Math.random() * 10) + 1;
    const n2 = Math.floor(Math.random() * 10) + 1;
    setNum1(n1);
    setNum2(n2);
    setAnswer("");
    onValidate(false); // Reset status validasi saat angka diacak ulang
  };

  // Jalankan generate angka pertama kali saat komponen dimuat
  useEffect(() => {
    generateNumbers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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