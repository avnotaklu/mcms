"use client";

import { useNotifications } from "@/app/context/NotificationContext";
import Link from "next/link";
import { Bell } from "lucide-react";

export default function NotificationBell({ setOpen }: NotificationBellProps) {
  const { notifications } = useNotifications();
  const unreadCount = notifications.length; // Get unread notifications count

  return (
    <button
      className="relative p-2 rounded-full hover:bg-gray-200 transition"
      onClick={() => setOpen(true)}
    >
      <Bell className="w-6 h-6 text-gray-700" />

      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
          {unreadCount}
        </span>
      )}
    </button>
  );
}

interface NotificationBellProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
