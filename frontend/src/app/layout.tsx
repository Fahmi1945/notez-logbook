import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Toast from "@/components/ui/toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NOTEZ. | Logbook Magang",
  description: "Platform manajemen logbook magang mahasiswa",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {children}
        {/* Toast dipasang di level tertinggi aplikasi */}
        <Toast /> 
      </body>
    </html>
  );
}