"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useReviewQueue } from "@/hooks/use-mentor-review";
import Skeleton from "@/components/ui/skeleton";

export default function ReviewListPage() {
  const { entries, isLoading, error, refetch } = useReviewQueue();

  const [activeTab, setActiveTab] = useState<"pending" | "reviewed">("pending");

  const pendingEntries = entries.filter((e) => e.status === "submitted");
  const reviewedEntries = entries.filter(
    (e) => e.status === "approved" || e.status === "rejected"
  );

  const displayedEntries = activeTab === "pending" ? pendingEntries : reviewedEntries;

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-6 animate-fade-in-up">
        <div className="mb-8">
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="flex gap-4 mb-6">
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
        <div className="grid gap-5">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                <div className="flex-1 space-y-3 w-full">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-6 w-32 rounded-md" />
                  </div>
                  <div>
                    <Skeleton className="h-7 w-3/4 mb-2" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-40" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-full max-w-2xl" />
                </div>
                <div className="shrink-0 w-full md:w-auto flex justify-end">
                  <Skeleton className="h-10 w-full md:w-40 rounded-lg" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4 text-rose-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Gagal Memuat Data</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <Button onClick={() => refetch()} variant="outline">Coba Lagi</Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 animate-fade-in-up">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-brand-dark mb-2">Review Logbook</h1>
        <p className="text-gray-500">Daftar logbook mahasiswa yang membutuhkan evaluasi Anda.</p>
      </div>

      <div className="flex items-center gap-2 mb-8 border-b border-gray-200 pb-px">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-5 py-2.5 text-sm font-semibold transition-all border-b-2 ${
            activeTab === "pending"
              ? "border-brand-primary text-brand-primary"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Pending Review
          {pendingEntries.length > 0 && (
            <span className="ml-2 inline-flex items-center justify-center bg-brand-primary text-white text-xs rounded-full h-5 px-2">
              {pendingEntries.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("reviewed")}
          className={`px-5 py-2.5 text-sm font-semibold transition-all border-b-2 ${
            activeTab === "reviewed"
              ? "border-brand-primary text-brand-primary"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Reviewed
          {reviewedEntries.length > 0 && (
            <span className="ml-2 inline-flex items-center justify-center bg-gray-200 text-gray-600 text-xs rounded-full h-5 px-2">
              {reviewedEntries.length}
            </span>
          )}
        </button>
      </div>

      <div className="grid gap-5">
        {displayedEntries.length === 0 ? (
          <Card className="bg-gray-50/50 border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-gray-100">
                {activeTab === "pending" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-primary"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-primary"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {activeTab === "pending" ? "Semua Selesai!" : "Belum Ada Riwayat"}
              </h3>
              <p className="text-gray-500 max-w-sm">
                {activeTab === "pending"
                  ? "Tidak ada logbook yang perlu direview saat ini. Kerja bagus!"
                  : "Anda belum melakukan review logbook apapun."}
              </p>
            </CardContent>
          </Card>
        ) : (
          displayedEntries.map((logbook) => (
            <Card key={logbook.id} className="transition-all duration-300 hover:shadow-lg hover:border-brand-primary/30 group">
              <CardContent className="p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge status={logbook.status} />
                    <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                      {new Date(logbook.activity_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  
                  <div>
                    <Link href={`/mentor/review/${logbook.id}`} className="block">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-primary transition-colors">
                        {logbook.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                      <div className="w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary text-xs font-bold uppercase">
                        {logbook.user?.name ? logbook.user.name.charAt(0) : '?'}
                      </div>
                      <span className="font-medium text-gray-800">{logbook.user?.name || 'Tidak ada nama'}</span>
                      <span className="text-gray-300">&bull;</span>
                      <span className="text-gray-500">{logbook.user?.email || 'Tidak ada email'}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                    {logbook.description}
                  </p>
                </div>
                
                <div className="shrink-0 w-full md:w-auto flex justify-end pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 mt-2 md:mt-0">
                  <Link href={`/mentor/review/${logbook.id}`} className="w-full md:w-auto">
                    <Button variant={activeTab === "pending" ? "primary" : "outline"} className={`w-full md:w-auto shadow-sm transition-all ${activeTab === 'pending' ? 'shadow-brand-primary/20 hover:shadow-md hover:-translate-y-0.5' : 'hover:bg-brand-primary/5 hover:text-brand-primary'}`}>
                      {activeTab === "pending" ? "Review Sekarang" : "Lihat Detail"}
                      {activeTab === "pending" && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                      )}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}