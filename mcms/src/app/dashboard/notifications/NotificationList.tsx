// app/notifications/NotificationList.js (Client Component)
"use client"; // Enables client-side interactivity

import { useState } from "react";
import NotificationItem from "./NotificationItem";
import { NotificationType } from "./notification_schema";
import { useNotifications } from "@/app/context/NotificationContext";

export default function NotificationList() {
  const { notifications, setNotifications } = useNotifications(); // Fetch notifications (server-side)

  function markAsRead(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <div className="space-y-4 min-h-[200px] flex flex-col items-center justify-center">
      {notifications.length === 0 ? (
        <div className="text-gray-500 text-center">No notifications</div>
      ) : (
        notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            markAsRead={markAsRead}
          />
        ))
      )}
    </div>
  );
}
