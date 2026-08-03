"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

interface DropdownProps {
  /** The trigger element (e.g. an icon button) */
  trigger: React.ReactNode;
  /** Dropdown items */
  children: React.ReactNode;
  /** Alignment of the dropdown panel relative to the trigger */
  align?: "left" | "right";
  /** Additional class for the panel container */
  className?: string;
}

interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Optional icon placed before the label */
  icon?: React.ReactNode;
  /** Visual variant */
  variant?: "default" | "danger";
  children: React.ReactNode;
}

// ─── Root ────────────────────────────────────────────────────────────────────

export function Dropdown({ trigger, children, align = "right", className }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, close]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, close]);

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen((prev) => !prev);
  };

  return (
    <div ref={ref} className="relative inline-block">
      {/* Trigger */}
      <div onClick={handleTriggerClick} role="button" tabIndex={0}>
        {trigger}
      </div>

      {/* Panel */}
      {open && (
        <div
          className={cn(
            "absolute top-full mt-1 min-w-[9rem] bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1 animate-fade-in-down",
            align === "right" ? "right-0" : "left-0",
            className
          )}
          onClick={() => close()}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Item ────────────────────────────────────────────────────────────────────

export function DropdownItem({
  icon,
  variant = "default",
  children,
  className,
  ...props
}: DropdownItemProps) {
  const variantStyles = {
    default: "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
    danger: "text-gray-600 hover:bg-rose-50 hover:text-rose-700",
  };

  return (
    <button
      className={cn(
        "w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}