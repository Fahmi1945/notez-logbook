import React from "react";
import { cn } from "./spinner"; // Ambil fungsi cn dari spinner

type BadgeStatus = "draft" | "submitted" | "pending" | "approved" | "rejected";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: BadgeStatus;
  children?: React.ReactNode;
}

export function Badge({ status, children, className, ...props }: BadgeProps) {
  const statusConfig: Record<BadgeStatus, { color: string; label: string }> = {
    draft: { color: "bg-gray-100 text-gray-700 border-gray-200", label: "Draft" },
    submitted: { color: "bg-blue-100 text-blue-700 border-blue-200", label: "Diserahkan" },
    pending: { color: "bg-amber-100 text-amber-700 border-amber-200", label: "Menunggu" },
    approved: { color: "bg-emerald-100 text-emerald-700 border-emerald-200", label: "Disetujui" },
    rejected: { color: "bg-rose-100 text-rose-700 border-rose-200", label: "Ditolak" },
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