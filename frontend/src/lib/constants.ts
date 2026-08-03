export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api";

/**
 * Centralized API endpoints for the Notez frontend application.
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },
  PROFILE: {
    BASE: "/profile",
    CHANGE_PASSWORD: "/change-password",
  },
  LOGBOOK: {
    BASE: "/logbook",
    BY_ID: (id: number | string) => `/logbook/${id}`,
    ATTACHMENT: (id: number | string) => `/logbook/attachments/${id}`,
    SUBMIT: (id: number | string) => `/logbook/submit/${id}`,
  },
  MENTORSHIP: {
    BASE: "/mentorship",
    HISTORY: "/mentorship/history",
    REQUEST: (mentorId: number | string) => `/mentorship/request/${mentorId}`,
    ACCEPT: (requestId: number | string) => `/mentorship/${requestId}/accepted`,
    REJECT: (requestId: number | string) => `/mentorship/${requestId}/rejected`,
    GET_ACTIVE_STUDENTS: "/mentor/tim",
  },
  MENTOR_REVIEW: {
    QUEUE: "/mentor/logbook",
    BY_ID: (id: number | string) => `/mentor/logbook/${id}`,
    EVALUATE: (id: number | string) => `/mentor/logbook/${id}/evaluate`,
  },
  NOTIFICATIONS: {
    BASE: "/notifications",
    READ: (id: number | string) => `/notifications/${id}/read`,
    READ_ALL: "/notifications/read-all",
  },
} as const;


