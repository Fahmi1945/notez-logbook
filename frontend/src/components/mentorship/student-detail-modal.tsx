// src/components/mentorship/student-detail-modal.tsx
import { ActiveStudent } from '@/types/mentorship';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Modal from '@/components/ui/modal';

interface StudentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: ActiveStudent | null;
}

export default function StudentDetailModal({ isOpen, onClose, student }: StudentDetailModalProps) {
  if (!student) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detail Mahasiswa">
      <div className="space-y-4 text-sm font-body">
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-brand-primary flex items-center justify-center font-heading font-bold text-sm">
            {student.studentName?.substring(0, 2).toUpperCase() || "NN"}
          </div>
          <div>
            <p className="font-heading font-bold text-base text-brand-dark">{student.studentName}</p>
            <p className="text-gray-500 text-xs">{student.studentEmail}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Status Tim</p>
            <Badge status={student.status === "ACTIVE" || student.status === "approved" ? "approved" : "submitted"} className="px-3 py-1 font-body">
              {student.status || "Aktif"}
            </Badge>
          </div>
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Total Entri</p>
            <p className="font-semibold text-gray-800">{student.totalEntries} Entri</p>
          </div>
        </div>

        <div>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Informasi Tambahan</p>
          <div className="bg-brand-white p-3 rounded-lg border border-gray-200 text-gray-700 min-h-[60px] leading-relaxed">
            {student.information || "Tidak ada informasi tambahan."}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end font-body">
        <Button 
          variant="outline" 
          onClick={onClose}
          className="text-gray-600 border-gray-300 hover:text-brand-dark hover:bg-gray-100 transition-colors"
        >
          Tutup
        </Button>
      </div>
    </Modal>
  );
}
