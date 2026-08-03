"use client";

import { useState } from "react";
import Link from "next/link";
import { getStoredUser } from "@/lib/auth-session";
import { useMentorDashboard } from "@/hooks/use-mentor-dashboard";
import { cn } from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Skeleton from "@/components/ui/skeleton";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";

import {
  Users, ClipboardText, CheckCircle, ArrowRight, Clock, Check,
} from "@phosphor-icons/react";

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function MentorDashboardPage() {
  const [name] = useState(() => getStoredUser()?.name || "Mentor");
  const {
    stats, recentPendingEntries, activeStudents,
    isLoading, reviewError, studentsError, refetch,
  } = useMentorDashboard();

  if (isLoading) return <DashboardSkeleton />;

  const statItems = [
    {
      label: "Mentee Aktif",
      value: stats.totalMentee,
      icon: Users,
      color: "text-brand-primary",
      bgColor: "bg-blue-50",
    },
    {
      label: "Logbook Perlu Ditinjau",
      value: stats.pendingReview,
      icon: ClipboardText,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      label: "Evaluasi Selesai",
      value: stats.completedReview,
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-10 space-y-8 animate-fade-in-up">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 font-body">
          Dashboard Mentor
        </p>
        <h1 className="mt-2 text-3xl font-bold text-brand-dark font-heading">
          Welcome, {name}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500 font-body">
          Ringkasan aktivitas bimbingan dan peninjauan logbook Anda.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {statItems.map((item) => (
          <Card key={item.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                item.bgColor
              )}>
                <item.icon size={24} className={item.color} weight="duotone" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 font-body">
                  {item.label}
                </p>
                <p className="mt-1 text-2xl font-bold text-brand-dark font-heading">
                  {item.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Antrean Peninjauan Logbook</CardTitle>
          <Link href="/mentor/review">
            <Button variant="ghost" size="sm" className="gap-1.5 text-brand-primary">
              Lihat Semua <ArrowRight size={16} />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {reviewError ? (
            <ErrorState message={reviewError} onRetry={refetch} />
          ) : recentPendingEntries.length === 0 ? (
            <EmptyState
              icon={CheckCircle}
              title="Semua Selesai!"
              description="Tidak ada logbook yang perlu ditinjau saat ini."
            />
          ) : (
            recentPendingEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-xl border border-gray-100 p-4 transition-colors hover:bg-gray-50/50 group"
              >
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Badge status={entry.status} />
                    <span className="text-xs text-gray-400 font-body">
                      {formatDate(entry.activity_date)}
                    </span>
                  </div>
                  <h4 className="font-semibold text-brand-dark font-heading line-clamp-1">
                    {entry.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-body">
                    <div className="h-5 w-5 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary text-[10px] font-bold uppercase shrink-0">
                      {entry.user?.name?.charAt(0) || "?"}
                    </div>
                    <span className="truncate">{entry.user?.name || "Tidak ada nama"}</span>
                  </div>
                </div>
                <Link href={`/mentor/review/${entry.id}`} className="shrink-0 ml-4">
                  <Button variant="primary" size="sm" className="shadow-sm gap-1.5">
                    Review <ArrowRight size={14} />
                  </Button>
                </Link>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Daftar Tim / Mentee Aktif</CardTitle>
          <Link href="/mentor/students">
            <Button variant="ghost" size="sm" className="gap-1.5 text-brand-primary">
              Lihat Semua <ArrowRight size={16} />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {studentsError ? (
            <div className="p-6">
              <ErrorState message={studentsError} onRetry={refetch} />
            </div>
          ) : activeStudents.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={Users}
                title="Belum Ada Mentee"
                description="Belum ada mahasiswa bimbingan aktif saat ini."
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>MAHASISWA</TableHead>
                  <TableHead className="text-center">TOTAL ENTRI</TableHead>
                  <TableHead className="text-center">MENUNGGU REVIEW</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeStudents.map((student) => (
                  <TableRow key={student.requestId}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 flex-shrink-0 rounded-full bg-blue-50 text-brand-primary flex items-center justify-center font-bold text-xs">
                          {student.studentName?.substring(0, 2).toUpperCase() || "NN"}
                        </div>
                        <div>
                          <div className="font-semibold text-brand-dark truncate">
                            {student.studentName}
                          </div>
                          {student.studentEmail && (
                            <div className="text-xs text-gray-400">
                              {student.studentEmail}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 border border-gray-200">
                        {student.totalEntries} Entri
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {student.waitingReview > 0 ? (
                        <Badge
                          status="submitted"
                          className="px-3 py-1 inline-flex items-center gap-1.5 justify-center"
                        >
                          <Clock size={14} className="shrink-0 text-amber-600" />
                          <span>{student.waitingReview} Perlu Review</span>
                        </Badge>
                      ) : (
                        <Badge
                          status="approved"
                          className="px-3 py-1 text-emerald-700 bg-emerald-50 border-emerald-200 inline-flex items-center gap-1.5 justify-center"
                        >
                          <Check size={14} className="shrink-0 text-emerald-600" />
                          <span>Selesai</span>
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

function DashboardSkeleton() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-10 space-y-8 animate-fade-in-up">
      <div>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-3 h-9 w-64" />
        <Skeleton className="mt-3 h-5 w-96" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="flex items-center gap-4 p-5">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="flex-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="mt-2 h-7 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><Skeleton className="h-6 w-64" /></CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><Skeleton className="h-6 w-52" /></CardHeader>
        <CardContent className="space-y-3 p-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    </section>
  );
}

function EmptyState({ icon: Icon, title, description }: {
  icon: React.ComponentType<{ size?: number; className?: string; weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone" }>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 border border-gray-100">
        <Icon size={24} className="text-brand-primary" weight="duotone" />
      </div>
      <h3 className="text-base font-semibold text-gray-800 font-heading">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-gray-500 font-body">{description}</p>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <p className="text-sm text-rose-500 font-body">{message}</p>
      <Button onClick={onRetry} variant="outline" size="sm" className="mt-3">
        Coba Lagi
      </Button>
    </div>
  );
}
