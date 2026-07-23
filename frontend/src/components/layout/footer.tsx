import React from "react";

export function Footer() {
  return (
    <footer className="w-full py-6 mt-auto text-center border-t border-gray-200">
      <p className="text-sm text-gray-500">
        &copy; {new Date().getFullYear()} NOTEZ Logbook. Didesain untuk kemudahan bimbingan mahasiswa.
      </p>
    </footer>
  );
}