"use client";

import React from "react";
import { Checks } from "@phosphor-icons/react";
import { Notification } from "@/types/notification";
import { NotificationItem } from "./notification-item";
import { NotificationEmpty } from "./notification-empty";
import Skeleton from "@/components/ui/skeleton";

interface NotificationPanelProps {
  notifications: Notification[];
  isLoading: boolean;
  unreadCount: number;
  onMarkAsRead: (id: number) => void;
  onMarkAllAsRead: () => void;
}

export function NotificationPanel({
  notifications,
  isLoading,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationPanelProps) {
  return (
    <div onClick={(e) => e.stopPropagation()}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h3 className="text-sm font-bold text-brand-dark font-heading">
          Notifikasi
        </h3>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="flex items-center gap-1.5 text-xs font-medium text-brand-primary
                       hover:text-brand-dark transition-colors"
          >
            <Checks className="w-4 h-4" />
            Tandai semua dibaca
          </button>
        )}
      </div>

      {/* Body: Scrollable list */}
      <div className="max-h-[400px] overflow-y-auto">
        {isLoading ? (
          /* Skeleton Loader — 4 placeholder items */
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-3 px-4 py-3">
                <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-3/4 rounded" />
                  <Skeleton className="h-3 w-full rounded" />
                  <Skeleton className="h-2.5 w-1/3 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <NotificationEmpty />
        ) : (
          <div className="divide-y divide-gray-50">
            {notifications.map((notif) => (
              <NotificationItem
                key={notif.id}
                notification={notif}
                onMarkAsRead={onMarkAsRead}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
