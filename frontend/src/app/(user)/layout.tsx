import React from "react";
import { requireAuth } from "@/lib/auth-guard";
import { AppShell } from "@/components/layout/app-shell";

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  await requireAuth("user");

  return <AppShell>{children}</AppShell>;
}