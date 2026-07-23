export type LogbookStatus = "draft" | "submitted" | "approved" | "rejected";

export interface Attachment {
  id: number;
  file_name: string;
  file_path: string;
}

export interface LogbookEntry {
  id: number;
  user_id: number;
  activity_date: string;
  title: string;
  description: string;
  obstacles: string | null;
  status: LogbookStatus;
  attachments?: Attachment[];
}