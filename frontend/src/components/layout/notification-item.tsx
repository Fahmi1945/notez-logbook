"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import {
  BookBookmark,
  UserPlus,
  Megaphone,
} from "@phosphor-icons/react";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale/id";
import { cn } from "@/lib/utils";
import { Notification } from "@/types/notification";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
}

/**
 * Inferensi tipe visual berdasarkan foreign key yang terisi.
 * - logbook_id !== null  → terkait logbook (biru)
 * - mentorships_id !== null → terkait mentorship (ungu)
 * - keduanya null → umum (amber)
 */
function getVisualConfig(notif: Notification) {
  if (notif.logbook_id !== null) {
    return {
      icon: BookBookmark,
      bgColor: "bg-blue-50",
      iconColor: "text-brand-primary",
    };
  }
  if (notif.mentorships_id !== null) {
    return {
      icon: UserPlus,
      bgColor: "bg-violet-50",
      iconColor: "text-violet-600",
    };
  }
  return {
    icon: Megaphone,
    bgColor: "bg-amber-50",
    iconColor: "text-amber-600",
  };
}

export function NotificationItem({
  notification,
  onMarkAsRead,
}: NotificationItemProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const config = getVisualConfig(notification);
  const Icon = config.icon;

  const timeAgo = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
    locale: idLocale,
  });

  const handleClick = () => {
    // Tandai sebagai dibaca jika belum
    if (!notification.is_read) {
      onMarkAsRead(notification.id);
    }

    // Navigasi yang disesuaikan dengan Role User
    const isMentor = user?.role === "mentor";

    if (notification.logbook_id !== null) {
      if (isMentor) {
        router.push(`/mentor/review/${notification.logbook_id}`);
      } else {
        router.push(`/logbook/${notification.logbook_id}`);
      }
    } else if (notification.mentorships_id !== null) {
      if (isMentor) {
        router.push("/mentor/students");
      } else {
        router.push("/mentorship");
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-brand-primary/10",
        !notification.is_read && "bg-brand-white/30"
      )}
    >
      {/* Ikon tipe */}
      <div
        className={cn(
          "w-9 h-9 rounded-full flex items-center justify-center shrink-0",
          config.bgColor
        )}
      >
        <Icon className={cn("w-5 h-5", config.iconColor)} weight="fill" />
      </div>

      {/* Konten */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm leading-snug",
            notification.is_read
              ? "text-gray-600"
              : "text-gray-900 font-semibold"
          )}
        >
          {notification.message}
        </p>
        <p className="text-[11px] text-gray-400 mt-1.5 font-mono">{timeAgo}</p>
      </div>

      {/* Indikator belum dibaca (dot biru) */}
      {!notification.is_read && (
        <span className="w-2.5 h-2.5 rounded-full bg-brand-primary shrink-0 mt-1.5" />
      )}
    </button>
  );
}
