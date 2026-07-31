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
  userId: number;
  mentorId: number;
  mentorName?: string;
  status: "pending" | "accepted" | "rejected";
  information?: string | null;
  createdAt: string;
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