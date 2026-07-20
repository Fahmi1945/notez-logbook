export type LogbookStatus = "draft" | "pending" | "submitted" | "approved" | "rejected";

export interface LogbookEntry {
  id: number;
  user_id: number;
  activity_date: string;
  title: string;
  description: string;
  obstacles: string | null;
  status: LogbookStatus;
}

export interface LogbookFormData {
  activity_date: string;
  title: string;
  description: string;
  obstacles?: string;
  status?: LogbookStatus;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}