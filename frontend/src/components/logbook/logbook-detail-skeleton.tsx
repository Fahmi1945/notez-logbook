import Skeleton from "@/components/ui/skeleton";
import { ArrowLeft } from "@phosphor-icons/react";
import Link from "next/link";

export default function LogbookDetailSkeleton() {
  return (
    <div className="p-6 max-w-4xl mx-auto font-body animate-fade-in-down">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/logbook"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-brand-primary mb-5 transition-colors font-medium pointer-events-none"
        >
          <ArrowLeft size={16} weight="bold" />
          Kembali ke Manajemen Logbook
        </Link>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="p-6 sm:p-8 border-b border-gray-100 bg-gradient-to-br from-brand-primary/5 to-transparent">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
            <div className="flex-1 min-w-0 space-y-4">
              <Skeleton className="h-7 w-3/4 max-w-lg" />
              <Skeleton className="h-7 w-40 rounded-xl" />
            </div>

            <div className="flex flex-col items-start sm:items-end gap-3 flex-shrink-0">
              <Skeleton className="h-7 w-24 rounded-full" />
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Deskripsi */}
          <div>
            <Skeleton className="h-4 w-40 mb-3" />
            <div className="p-5 bg-gray-50/70 rounded-xl border border-gray-100 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>

          {/* Hambatan */}
          <div>
            <Skeleton className="h-4 w-48 mb-3" />
            <div className="p-5 bg-rose-50/50 rounded-xl border border-rose-100/50 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
          
          {/* Lampiran */}
          <div>
             <Skeleton className="h-4 w-32 mb-3" />
             <div className="space-y-4">
               <Skeleton className="h-16 w-full max-w-xl rounded-xl" />
               <Skeleton className="h-16 w-full max-w-xl rounded-xl" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
