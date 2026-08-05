"use client";

import React from "react";
import { Bell } from "@phosphor-icons/react";
import { Dropdown } from "@/components/ui/dropdown";
import { NotificationPanel } from "./notification-panel";
import { useNotifications } from "@/hooks/use-notifications";

export function NotificationBell() {
  const {
    notifications,
    unreadCount,
    isLoading,
    handleMarkAsRead,
    handleMarkAllAsRead,
  } = useNotifications();

  const triggerButton = (
    <button
      className="relative p-2 text-gray-400 hover:text-brand-primary transition-colors
                 rounded-full hover:bg-brand-soft/50 focus:outline-none focus:ring-2
                 focus:ring-brand-primary/50"
      title="Notifikasi"
      id="notification-bell-trigger"
    >
      <Bell className="w-6 h-6" weight="regular" />

      {/* Badge angka unread */}
      {unreadCount > 0 && (
        <span
          className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 flex items-center
                     justify-center px-1 text-[11px] font-bold text-white bg-status-rejected
                     rounded-full border-2 border-white animate-scale-in"
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );

  return (
    <Dropdown
      trigger={triggerButton}
      align="right"
      className="w-[380px] max-w-[calc(100vw-2rem)] p-0 overflow-hidden"
    >
      <NotificationPanel
        notifications={notifications}
        isLoading={isLoading}
        unreadCount={unreadCount}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />
    </Dropdown>
  );
}