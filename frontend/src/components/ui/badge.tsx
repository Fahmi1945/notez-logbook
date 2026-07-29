import React from "react";
import { cn } from "@/lib/utils";

import { LogbookStatus } from "@/types/entry";
type BadgeStatus = LogbookStatus;

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: BadgeStatus;
  children?: React.ReactNode;
}

export function Badge({ status, children, className, ...props }: BadgeProps) {
  // Warna disesuaikan dengan Palet Opsi 1: Modern Emerald & Rose
  const statusConfig: Record<BadgeStatus, { color: string; label: string }> = {
    draft: { color: "bg-slate-50 text-slate-700 border-slate-200", label: "Draft" },
    submitted: { color: "bg-violet-50 text-violet-700 border-violet-200", label: "Submitted" },
    approved: { color: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Approved" },
    rejected: { color: "bg-rose-50 text-rose-700 border-rose-200", label: "Rejected" },
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