import { NotificationType } from "./notification_schema";

// app/notifications/NotificationItem.js
export default function NotificationItem({
  notification,
  markAsRead,
}: NotificationItemProps) {
  return (
    <div className={`p-4 border rounded-lg ${"bg-blue-100"}`}>
      <p className="text-sm">{notification.message}</p>
      <button
        onClick={() => markAsRead(notification.id)}
        className="mt-2 text-blue-500 underline text-xs"
      >
        Mark as Read
      </button>
    </div>
  );
}

interface NotificationItemProps {
  notification: NotificationType;
  markAsRead: (id: string) => void;
}
