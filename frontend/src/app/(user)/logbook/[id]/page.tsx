"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react";
import { LogbookDetail } from "@/components/logbook/logbook-detail";
import LogbookDetailSkeleton from "@/components/logbook/logbook-detail-skeleton";
import { entriesApi } from "@/lib/api/entries";
import { LogbookEntry } from "@/types/entry";
import { MESSAGES } from "@/config/messages";

export default function LogbookDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [entry, setEntry] = useState<LogbookEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const res = await entriesApi.getById(id);
        setEntry(res.data);
      } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } } };
        setError(e.response?.data?.message || MESSAGES.LOGBOOK.FETCH_FAILED);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <LogbookDetailSkeleton />
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="p-6 max-w-4xl mx-auto font-body mt-10">
        <div className="text-center p-10 bg-rose-50 text-rose-600 rounded-2xl border border-rose-200 animate-fade-in-down shadow-sm">
          <p className="font-heading font-bold text-lg mb-2">Terjadi Kesalahan</p>
          <p className="text-sm mb-6 text-rose-500">{error || "Data logbook tidak ditemukan."}</p>
          <Link
            href="/logbook"
            className="inline-flex px-6 py-2.5 bg-white border border-rose-200 rounded-xl text-sm hover:bg-rose-50 transition-colors font-medium text-rose-700 shadow-sm"
          >
            Kembali ke Daftar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto font-body animate-fade-in-down">
      <div className="mb-6">
        <Link
          href="/logbook"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-brand-primary mb-5 transition-colors font-medium"
        >
          <ArrowLeft size={16} weight="bold" />
          Kembali ke Manajemen Logbook
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden p-6 sm:p-8">
        <LogbookDetail 
          entry={entry} 
          onEdit={() => router.push(`/logbook/${entry.id}/edit`)} 
        />
      </div>
    </div>
  );
}
