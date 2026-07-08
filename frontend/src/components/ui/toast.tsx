"use client";

import { useUIStore } from "@/store/ui-store";
import { motion, AnimatePresence } from "framer-motion";

export default function Toast() {
  const { toastMessage, toastType } = useUIStore();

  const bgColors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-[#2B549A]",
  };

  return (
    <AnimatePresence>
      {toastMessage && (
        
        <div className="fixed top-8 inset-x-0 z-50 flex justify-center pointer-events-none">
          
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            // Kembalikan pointer-events-auto agar toastnya sendiri tetap bisa diinteraksi (jika ada tombol close nantinya)
            className="pointer-events-auto"
          >
            <div 
              className={`${bgColors[toastType]} text-white px-6 py-3 rounded-2xl shadow-2xl font-medium text-sm flex items-center gap-3 border border-white/10`}
            >
              {toastMessage}
            </div>
          </motion.div>
          
        </div>
      )}
    </AnimatePresence>
  );
}