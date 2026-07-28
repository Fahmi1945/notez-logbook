import Skeleton from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function LogbookListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Card className="border-gray-200 overflow-hidden animate-fade-in-down">
      {/* ── DESKTOP TABLE SKELETON ──────────────────────────────────────────────── */}
      <div className="hidden md:block">
        <div className="w-full">
          {/* Header */}
          <div className="flex border-b border-gray-100 bg-gray-50/50 p-4 gap-4">
            <div className="w-1/6"><Skeleton className="h-4 w-16" /></div>
            <div className="w-1/2"><Skeleton className="h-4 w-32" /></div>
            <div className="w-1/12 flex justify-center"><Skeleton className="h-4 w-16" /></div>
            <div className="w-1/12 flex justify-center"><Skeleton className="h-4 w-12" /></div>
            <div className="w-1/12 flex justify-center"><Skeleton className="h-4 w-12" /></div>
          </div>
          {/* Rows */}
          <div className="divide-y divide-gray-100">
            {Array.from({ length: rows }).map((_, i) => (
              <div key={i} className="flex p-4 gap-4 items-center">
                {/* Tanggal */}
                <div className="w-1/6">
                  <Skeleton className="h-7 w-24 rounded-lg" />
                </div>
                {/* Judul & Deskripsi */}
                <div className="w-1/2 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                </div>
                {/* Lampiran */}
                <div className="w-1/12 flex justify-center">
                  <Skeleton className="h-6 w-8 rounded-lg" />
                </div>
                {/* Status */}
                <div className="w-1/12 flex justify-center">
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                {/* Aksi */}
                <div className="w-1/12 flex justify-center">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MOBILE CARDS SKELETON ───────────────────────────────────────────────── */}
      <div className="md:hidden divide-y divide-gray-50">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4">
            {/* Top row */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-6 w-32 rounded-lg" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>

            {/* Description */}
            <div className="space-y-1.5 mb-3">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
            </div>

            {/* Bottom row */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-50">
              <Skeleton className="h-5 w-20 rounded-md" />
              <div className="flex gap-2">
                 <Skeleton className="h-8 w-16 rounded-lg" />
                 <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
