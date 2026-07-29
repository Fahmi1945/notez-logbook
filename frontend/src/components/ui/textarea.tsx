import React from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, id, className, ...props }: TextareaProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-gray-700 block">
          {label}
        </label>
      )}
      <textarea
        id={id}
        {...props}
        className={cn(
          "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all placeholder:text-gray-400 text-gray-800 min-h-[120px] resize-y",
          className
        )}
      />
    </div>
  );
}
