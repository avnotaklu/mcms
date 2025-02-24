// app/notifications/page.js (Server Component)
import { useNotifications } from "@/app/context/NotificationContext";
import { NotificationType } from "./notification_schema";
import NotificationList from "./NotificationList";


export default async function NotificationsPage() {

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <NotificationList />
    </div>
  );
}
