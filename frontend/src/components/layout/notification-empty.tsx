import React from "react";
import { BellSlash } from "@phosphor-icons/react";

export function NotificationEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
        <BellSlash className="w-7 h-7 text-gray-400" weight="duotone" />
      </div>
      <p className="text-sm font-semibold text-gray-700">
        Belum ada notifikasi
      </p>
      <p className="text-xs text-gray-400 mt-1">
        Notifikasi baru akan muncul di sini.
      </p>
    </div>
  );
}
