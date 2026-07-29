// src/components/mentorship/active-student-list.tsx
"use client";

import { useState } from 'react';
import StudentDetailModal from './student-detail-modal';
import { ActiveStudent } from '@/types/mentorship';
import { Button } from "@/components/ui/button"; 
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Clock, Check } from "@phosphor-icons/react";

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function ActiveStudentsList({ data }: { data: ActiveStudent[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<ActiveStudent | null>(null);

  const handleViewDetail = (student: ActiveStudent) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  if (!data || data.length === 0) {
    return (
      <div className="text-center p-8 text-brand-dark bg-white rounded-xl border border-gray-200 mt-4 animate-fade-in-down font-mono">
        Belum ada data mahasiswa aktif.
      </div>
    );
  }

  return (
    <>
      <div className="mt-4 animate-fade-in-down">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>TANGGAL UPDATE</TableHead>
              <TableHead>MAHASISWA</TableHead>
              <TableHead className="text-center">TOTAL ENTRI</TableHead>
              <TableHead className="text-center">MENUNGGU REVIEW</TableHead>
              <TableHead className="text-center">AKSI</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.requestId}>
                {/* Tanggal Update */}
                <TableCell className="text-gray-500">
                  {formatDate(item.updatedAt)}
                </TableCell>
                
                {/* Mahasiswa */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 flex-shrink-0 rounded-full bg-blue-50 text-brand-primary flex items-center justify-center font-bold text-xs">
                      {item.studentName?.substring(0, 2).toUpperCase() || "NN"}
                    </div>
                    <div>
                      <div className="font-semibold text-brand-dark truncate">
                        {item.studentName}
                      </div>
                      {item.studentEmail && (
                        <div className="text-xs text-gray-400">
                          {item.studentEmail}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                
                {/* Total Entri */}
                <TableCell className="text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                    {item.totalEntries} Entri
                  </span>
                </TableCell>
                
                {/* Menunggu Review */}
                <TableCell className="text-center">
                  {item.waitingReview > 0 ? (
                    <Badge status="submitted" className="px-3 py-1 inline-flex items-center gap-1.5 justify-center">
                      <Clock size={14} className="shrink-0 text-amber-600" />
                      <span>{item.waitingReview} Perlu Review</span>
                    </Badge>
                  ) : (
                    <Badge status="approved" className="px-3 py-1 text-emerald-700 bg-emerald-50 border-emerald-200 inline-flex items-center gap-1.5 justify-center">
                      <Check size={14} className="shrink-0 text-emerald-600" />
                      <span>Selesai</span>
                    </Badge>
                  )}
                </TableCell>
                
                {/* Aksi */}
                <TableCell className="text-center">
                  <Button 
                    onClick={() => handleViewDetail(item)}
                    variant="primary"
                    size="sm"
                    className="h-8 px-3 text-xs font-mono shadow-sm"
                  >
                    Lihat Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <StudentDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        student={selectedStudent} 
      />
    </>
  );
}

