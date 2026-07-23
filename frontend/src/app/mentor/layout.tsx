import React from "react";
import { requireAuth } from "@/lib/auth-guard";
import { AppShell } from "@/components/layout/app-shell";

export default async function MentorLayout({ children }: { children: React.ReactNode }) {
  await requireAuth("mentor");

  return <AppShell>{children}</AppShell>;
}