import React from "react";

interface AuthWrapperProps {
  heading: React.ReactNode;
  description: React.ReactNode;
  children: React.ReactNode;
}

export default function AuthWrapper({ heading, description, children }: AuthWrapperProps) {
  return (
    <div className="flex w-full max-w-[780px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden min-h-[550px]">
      
      {/* KOLOM KIRI - Branding UI yang Menerima Props Dinamis */}
      <div className="hidden md:flex flex-col justify-between w-1/2 bg-brand-primary p-10 text-white relative overflow-hidden">
          <div className="absolute -bottom-40 -left-5 w-64 h-64 bg-brand-accent/30 rounded-full blur-[70px] pointer-events-none"></div>

          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/30 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      
        <div className="relative z-10">
          <h1 className="text-[2rem] font-bold leading-[1.3] tracking-tight mb-4">
            {heading} {/* <--- Teks H1 dinamis masuk ke sini */}
          </h1>
          <p className="text-sm text-white/80 leading-relaxed max-w-[90%] font-body">
            {description}
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className="w-7 h-7 rounded-full bg-brand-accent flex items-center justify-center text-[10px] font-bold border-2 border-[#2B549A]">BS</div>
            <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold border-2 border-[#2B549A]">FA</div>
          </div>
          <span className="text-xs font-medium text-white/90 tracking-wide">
            Digunakan oleh +1.000 Mahasiswa
          </span>
        </div>
      </div>

      {/* KOLOM KANAN - Area Form */}
      <div className="w-full md:w-1/2 px-10 py-12 flex flex-col justify-center bg-white">
        {children}
      </div>

    </div>
  );
}