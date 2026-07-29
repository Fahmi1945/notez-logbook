import Skeleton from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function LogbookFormSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in-down font-body w-full">
      {/* Card Utama */}
      <Card className="mb-6 border-gray-200">
        <CardHeader className="px-6 sm:px-8 py-5 bg-gradient-to-r from-brand-primary/5 to-transparent">
          <Skeleton className="h-5 w-48 mb-1" />
          <Skeleton className="h-3 w-64" />
        </CardHeader>

        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Tanggal */}
          <div>
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>

          {/* Judul */}
          <div>
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>

          {/* Deskripsi */}
          <div>
            <Skeleton className="h-4 w-40 mb-2" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>

          {/* Hambatan */}
          <div>
            <Skeleton className="h-4 w-48 mb-2" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        </CardContent>
      </Card>

      {/* Card Attachment */}
      <Card className="border-gray-200">
        <CardHeader className="px-6 sm:px-8 py-5 bg-gradient-to-r from-brand-accent/5 to-transparent">
          <Skeleton className="h-5 w-32 mb-1" />
          <Skeleton className="h-3 w-64" />
        </CardHeader>

        <CardContent className="p-6 sm:p-8">
          <Skeleton className="h-40 w-full rounded-2xl" />
        </CardContent>
      </Card>

      {/* Tombol Aksi */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2 pb-6">
        <Skeleton className="h-11 w-32 rounded-xl" />
        <Skeleton className="h-11 w-48 rounded-xl" />
      </div>
    </div>
  );
}
