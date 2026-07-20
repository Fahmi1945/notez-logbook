"use client";

import { LogbookEntry } from "@/types/entry";
import { Eye, Pencil, Trash, CalendarBlank } from "@phosphor-icons/react";
import Link from "next/link";

interface EntryListProps {
  entries: LogbookEntry[];
  onDelete: (id: number) => void;
}

export default function EntryList({ entries, onDelete }: EntryListProps) {
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return <span className="badge-approved px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 font-body w-max">✓ Approved</span>;
      case "submitted":
      case "pending": 
        return <span className="badge-submitted px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 font-body w-max">⏱ Submitted</span>;
      case "rejected":
        return <span className="badge-rejected px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 font-body w-max">✕ Rejected</span>;
      default:
        return <span className="badge-draft px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 font-body w-max">📝 Draft</span>;
    }
  };

  if (entries.length === 0) {
    return (
      <div className="text-center p-8 text-brand-dark bg-white border border-gray-200 rounded-xl font-body animate-fade-in-down shadow-sm">
        Belum ada entri logbook.
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden animate-fade-in-down">
      <table className="w-full text-sm text-left">
        <thead className="bg-brand-white text-brand-dark font-heading font-bold uppercase text-xs border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 whitespace-nowrap">TANGGAL</th>
            <th className="px-6 py-4 w-full">JUDUL & DESKRIPSI SINGKAT</th>
            <th className="px-6 py-4 whitespace-nowrap text-center">STATUS</th>
            <th className="px-6 py-4 whitespace-nowrap text-center">AKSI</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 font-body">
          {entries.map((entry) => (
            <tr key={entry.id} className="hover:bg-brand-white-bg transition-colors">
              
              {/* Kolom Tanggal (Sudah pakai Phosphor Icon) */}
              <td className="px-6 py-4 align-top whitespace-nowrap">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-white border border-gray-200 rounded-lg text-gray-600 font-medium text-xs">
                  <CalendarBlank size={16} weight="regular" className="text-gray-500" />
                  {new Date(entry.activity_date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </td>

              {/* Kolom Judul & Deskripsi */}
              <td className="px-6 py-4 align-top">
                <h4 className="text-brand-dark font-heading font-bold text-base mb-1">
                  {entry.title}
                </h4>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {entry.description}
                </p>
                {/* Jika status rejected dan ada obstacles, tampilkan pesan revisi */}
                {entry.status === "rejected" && entry.obstacles && (
                  <p className="text-status-rejected text-xs mt-2 font-medium flex items-start gap-1">
                    <span className="mt-0.5">•</span> Revisi: {entry.obstacles}
                  </p>
                )}
              </td>

              {/* Kolom Status */}
              <td className="px-6 py-4 align-top text-center whitespace-nowrap">
                <div className="flex justify-center">
                  {getStatusBadge(entry.status)}
                </div>
              </td>

              {/* Kolom Aksi */}
              <td className="px-6 py-4 align-top whitespace-nowrap">
                <div className="flex justify-center gap-3 text-gray-400">
                  <Link href={`/logbook/${entry.id}`} className="hover:text-brand-primary transition-colors">
                    <Eye size={20} weight="regular" />
                  </Link>
                  
                  {/* Hanya bisa Edit/Delete kalau statusnya belum final (Draft / Rejected) */}
                  {(entry.status === "draft" || entry.status === "rejected") && (
                    <>
                      <Link href={`/logbook/${entry.id}/edit`} className="hover:text-brand-accent transition-colors">
                        <Pencil size={20} weight="regular" />
                      </Link>
                      <button onClick={() => onDelete(entry.id)} className="hover:text-status-rejected transition-colors">
                        <Trash size={20} weight="regular" />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}