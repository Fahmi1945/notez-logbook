"use client";

import React from "react";
import Skeleton  from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div>
        <Skeleton className="h-4 w-40 mb-3" />
        <Skeleton className="h-8 w-72 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Stat cards skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-4 w-20 mb-4" />
                <Skeleton className="h-8 w-12" />
              </div>
              <Skeleton className="h-12 w-12 rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent entries skeleton */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4 flex justify-between">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-6 py-4 border-b border-slate-50"
          >
            <div>
              <Skeleton className="h-4 w-56 mb-2" />
              <Skeleton className="h-3 w-36" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>

      {/* Bottom grid skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <Skeleton className="h-5 w-28 mb-4" />
          <div className="space-y-3">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <Skeleton className="h-5 w-36 mb-4" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
