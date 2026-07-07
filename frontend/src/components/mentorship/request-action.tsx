"use client";

import React from "react";

interface RequestActionProps {
  onApply?: () => void;
}

export function RequestAction({ onApply }: RequestActionProps) {
  return (
    <button
      onClick={onApply}
      className="px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap bg-brand-primary text-white hover:bg-brand-dark shadow-sm hover:shadow"
    >
      Ajukan Bimbingan
    </button>
  );
}