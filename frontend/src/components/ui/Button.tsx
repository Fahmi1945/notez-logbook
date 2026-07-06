import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import Spinner from "./spinner";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, disabled, isLoading, ...props }, ref) => {
    return (
      <button
        ref={ref}
        // Menonaktifkan tombol jika sedang loading ATAU memang di-set disabled
        disabled={disabled || isLoading} 
        className={cn(
          "flex items-center justify-center gap-2", // Mengatur posisi teks dan spinner sejajar
          "disabled:opacity-70 disabled:cursor-not-allowed transition-all",
          className
        )}
        {...props}
      >
        {/* Tampilkan spinner hanya saat isLoading true */}
        {isLoading && <Spinner className="w-4 h-4" />}
        
        {/* Teks bawaan tombol (misal: "Masuk") */}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;