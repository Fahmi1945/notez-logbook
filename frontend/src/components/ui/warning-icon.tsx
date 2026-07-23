"use client";

import { WarningCircle, Warning } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface WarningIconProps {
  size?: number;
  variant?: "circle" | "triangle";
  className?: string;
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
}

/**
 * Reusable warning icon menggunakan Phosphor Icons.
 * - variant="circle"   → WarningCircle (default, cocok untuk inline error)
 * - variant="triangle" → Warning       (cocok untuk alert/dialog)
 */
export function WarningIcon({
  size = 16,
  variant = "circle",
  className,
  weight = "fill",
}: WarningIconProps) {
  const baseClass = cn("shrink-0", className);

  if (variant === "triangle") {
    return <Warning size={size} weight={weight} className={baseClass} />;
  }

  return <WarningCircle size={size} weight={weight} className={baseClass} />;
}
