import React from "react";
import { cn } from "./spinner"; // Ambil fungsi cn dari spinner

type BadgeStatus = "draft" | "submitted" | "pending" | "approved" | "rejected";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: BadgeStatus;
  children?: React.ReactNode;
}

export function Badge({ status, children, className, ...props }: BadgeProps) {
  // Warna disesuaikan dengan Palet Opsi 1: Modern Emerald & Rose
  const statusConfig: Record<BadgeStatus, { color: string; label: string }> = {
    draft: { color: "bg-slate-50 text-slate-700 border-slate-200", label: "Draft" },
    submitted: { color: "bg-violet-50 text-violet-700 border-violet-200", label: "Diserahkan" },
    pending: { color: "bg-amber-50 text-amber-700 border-amber-200", label: "Menunggu" }, 
    approved: { color: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Disetujui" },
    rejected: { color: "bg-rose-50 text-rose-700 border-rose-200", label: "Ditolak" },
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        statusConfig[status].color,
        className
      )}
      {...props}
    >
      {children || statusConfig[status].label}
    </span>
  );
}