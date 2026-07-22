// Mewakili data mentor di Katalog
export interface Mentor {
  id: number;
  name: string;
  email: string;
  studentCount: number;
}

// Mewakili data di Riwayat Pengajuan
export interface MentorshipHistory {
  id: number;
  user_id: number;
  mentor_id: number;
  mentor_name?: string;
  status: "pending" | "accepted" | "rejected";
  information?: string | null;
  created_at: string;
}

// types/mentor.ts
export interface ActiveStudent {
  requestId: string | number;
  studentId: string | number;
  studentName: string;
  studentEmail: string;
  status: string;
  information: string;
  updatedAt: string;
  totalEntries: number;
  waitingReview: number;
}