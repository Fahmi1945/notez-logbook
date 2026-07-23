import React from "react";
import { Spinner } from "./spinner";
import { cn } from "@/lib/utils"; 

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-semibold transition-all rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap";
  
  const variants = {
    primary: "bg-brand-primary text-white hover:bg-brand-dark shadow-sm focus:ring-brand-primary",
    secondary: "bg-blue-50 text-brand-primary hover:bg-blue-100 focus:ring-brand-primary",
    outline: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-brand-primary",
    danger: "bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-500 shadow-sm",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Spinner size="sm" className="mr-2" />}
      {children}
    </button>
  );
}