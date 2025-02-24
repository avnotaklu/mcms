"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { NotificationType } from "../dashboard/notifications/notification_schema";

const WS_URL = "ws://localhost:8080";

interface NotificationContextType {
  notifications: NotificationType[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationType[]>>;
}

export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  useEffect(() => {
    const socket = new WebSocket(WS_URL);

    socket.onopen = () => console.log("WebSocket connected");

    socket.onmessage = (event) => {
      const newNotification: NotificationType = JSON.parse(event.data);
      setNotifications((prev) => [newNotification, ...prev]);
    };

    socket.onclose = () => console.log("WebSocket disconnected");

    return () => socket.close();
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}
