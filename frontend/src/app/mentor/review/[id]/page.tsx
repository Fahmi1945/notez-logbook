"use client";

import React, { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PdfViewer } from "@/components/review/pdf-viewer";
import { ReviewForm } from "@/components/review/review-form";
import { useReviewDetail } from "@/hooks/use-mentor-review";
import Skeleton from "@/components/ui/skeleton";

export default function ReviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  
  const { entry, isLoading, isProcessing, error, refetch, submitReview } = useReviewDetail(id);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-10 px-6 animate-fade-in-up">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-24" />
            <div className="h-5 w-px bg-gray-200"></div>
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <Skeleton className="h-6 w-48 mb-4 rounded-md" />
              <Skeleton className="h-10 w-3/4 mb-6" />
              
              <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-gray-50 to-white rounded-2xl mb-8 border border-gray-100">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <Skeleton className="h-7 w-48 mb-3" />
                  <Skeleton className="h-32 w-full rounded-2xl" />
                </div>
                <div>
                  <Skeleton className="h-7 w-48 mb-3" />
                  <Skeleton className="h-24 w-full rounded-2xl" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <Skeleton className="h-7 w-32 mb-4" />
              <Skeleton className="h-48 w-full rounded-2xl" />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                <Skeleton className="h-7 w-40" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="pt-4 space-y-3">
                  <Skeleton className="h-10 w-full rounded-xl" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4 text-rose-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Gagal Memuat Detail</h3>
        <p className="text-gray-500 mb-4">{error || "Entri tidak ditemukan"}</p>
        <div className="flex gap-3">
          <Link href="/mentor/review">
            <Button variant="outline">Kembali ke Daftar</Button>
          </Link>
          <Button onClick={() => refetch()} variant="primary">Coba Lagi</Button>
        </div>
      </div>
    );
  }

  // Proxy digunakan agar request lampiran menyertakan Bearer token
  const getProxyAttachmentUrl = (id: number) => {
    return `/api/proxy/attachments/${id}`;
  };
  
  return (
    <div className="max-w-7xl mx-auto py-10 px-6 animate-fade-in-up">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/mentor/review">
            <Button variant="ghost" size="sm" className="pl-2 -ml-2 text-gray-500 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><path d="m15 18-6-6 6-6"/></svg>
              Kembali
            </Button>
          </Link>
          <div className="h-5 w-px bg-gray-200"></div>
          <Badge status={entry.status} className="text-sm px-3 py-1" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <p className="inline-block px-3 py-1 bg-brand-soft/50 text-brand-dark rounded-md text-sm font-semibold mb-4 tracking-wider">
              {new Date(entry.activity_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <h1 className="text-3xl font-bold text-brand-dark mb-6 leading-tight">{entry.title}</h1>
            
            <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-blue-50 to-white rounded-2xl mb-8 border border-blue-100/50">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary font-bold text-lg shadow-inner uppercase">
                {entry.user?.name ? entry.user.name.charAt(0) : '?'}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{entry.user?.name || 'Tidak ada nama'}</p>
                <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5h4.6a2 2 0 0 1 1.9 1.4L14 9"/></svg>
                  {entry.user?.email || 'Tidak ada email'}
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  </span>
                  Deskripsi Aktivitas
                </h3>
                <p className="text-gray-700 leading-relaxed bg-gray-50/80 p-5 rounded-2xl border border-gray-100 text-[15px] whitespace-pre-wrap">
                  {entry.description}
                </p>
              </div>

              {entry.obstacles && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    </span>
                    Kendala / Hambatan
                  </h3>
                  <p className="text-gray-700 leading-relaxed bg-rose-50/50 p-5 rounded-2xl border border-rose-100/50 text-[15px] whitespace-pre-wrap">
                    {entry.obstacles}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {entry.attachments && entry.attachments.length > 0 && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                </span>
                Lampiran
              </h3>
              <div className="space-y-4">
                {entry.attachments.map(att => (
                  <PdfViewer 
                    key={att.id} 
                    url={getProxyAttachmentUrl(att.id)} 
                    title={att.file_name} 
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <Card className="border-brand-primary/20 shadow-xl shadow-brand-primary/5">
              <CardHeader className="bg-gradient-to-b from-brand-primary/5 to-transparent rounded-t-2xl border-b-brand-primary/10 pb-4">
                <CardTitle className="text-brand-dark flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-primary"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                  Tindakan Review
                </CardTitle>
                <CardDescription>
                  Berikan penilaian dan keputusan Anda terhadap logbook ini.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-5">
                {entry.status !== "submitted" ? (
                  <div className="text-center py-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-gray-500 mb-2">Review sudah diselesaikan</p>
                    <Badge status={entry.status} className="text-sm px-3 py-1" />
                  </div>
                ) : (
                  <ReviewForm 
                    submitReview={submitReview}
                    isProcessing={isProcessing}
                    onSuccess={() => router.push('/mentor/review')} 
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
