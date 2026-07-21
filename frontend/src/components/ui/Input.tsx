import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

export default function Input({ label, icon, id, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-gray-700 block">
        {label}
      </label>
      <div className="relative flex items-center">
        {/* Render icon jika ada */}
        {icon && (
          <div className="absolute left-3.5 text-gray-400 flex items-center justify-center">
            {icon}
          </div>
        )}
        <input
          id={id}
          {...props}
          className={`w-full ${
            icon ? "pl-10" : "pl-4"
          } pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all placeholder:text-gray-400 text-gray-800`}
        />
      </div>
    </div>
  );
}