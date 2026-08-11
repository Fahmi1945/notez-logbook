"use client";

import React from "react";
import {
  BookBookmark,
  NotePencil,
  PaperPlaneTilt,
  CheckCircle,
} from "@phosphor-icons/react";
import { useAuthStore } from "@/store/auth-store";
import { useDashboard } from "@/hooks/use-dashboard";
import { StatCard } from "@/components/dashboard/stat-card";
import { RecentEntries } from "@/components/dashboard/recent-entries";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { MentorCard } from "@/components/dashboard/mentor-card";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { Button } from "@/components/ui/button";

export function DashboardClient() {
  const { user } = useAuthStore();
  const { stats, recentEntries, activeMentor, isLoading, error, refetch } =
    useDashboard();

  if (isLoading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-rose-600 font-medium">{error}</p>
        <Button variant="outline" onClick={refetch} className="mt-4">
          Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    <section className="space-y-8 animate-fade-in-down">
      {/* ① Greeting Header */}
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400 font-mono">
          Dashboard Mahasiswa
        </p>
        <h1 className="mt-2 text-2xl font-bold text-brand-dark font-heading sm:text-3xl">
          Welcome,{" "}
          <span className="text-brand-accent">
            {user?.name || "Mahasiswa"}!
          </span> 
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 font-body">
          Pantau progres logbook magang Anda dari sini.
        </p>
      </div>

      {/* ② Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Entri"
          value={stats.total}
          icon={
            <BookBookmark
              className="w-6 h-6 text-brand-primary"
              weight="duotone"
            />
          }
          accentColor="text-brand-primary"
          bgColor="bg-blue-50"
        />
        <StatCard
          label="Draft"
          value={stats.draft}
          icon={
            <NotePencil
              className="w-6 h-6 text-status-draft"
              weight="duotone"
            />
          }
          accentColor="text-status-draft"
          bgColor="bg-slate-50"
        />
        <StatCard
          label="Diajukan"
          value={stats.submitted}
          icon={
            <PaperPlaneTilt
              className="w-6 h-6 text-status-submitted"
              weight="duotone"
            />
          }
          accentColor="text-status-submitted"
          bgColor="bg-violet-50"
        />
        <StatCard
          label="Disetujui"
          value={stats.approved}
          icon={
            <CheckCircle
              className="w-6 h-6 text-status-approved"
              weight="duotone"
            />
          }
          accentColor="text-status-approved"
          bgColor="bg-emerald-50"
        />
      </div>

      {/* ③ Recent Entries */}
      <RecentEntries entries={recentEntries} />

      {/* ④ Quick Actions + Mentor Card */}
      <div className="grid gap-6 md:grid-cols-2">
        <QuickActions hasActiveMentor={!!activeMentor} />
        <MentorCard activeMentor={activeMentor} />
      </div>
    </section>
  );
}
