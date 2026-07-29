"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  accentColor: string;
  bgColor: string;
}

export function StatCard({
  label,
  value,
  icon,
  accentColor,
  bgColor,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 font-body">
            {label}
          </p>
          <p
            className={cn(
              "mt-2 text-3xl font-bold font-heading",
              accentColor
            )}
          >
            {value}
          </p>
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl",
            bgColor
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
