import { Bell } from "lucide-react"; // Icon for alerts
import LogoutButton from "./user_actions_menu";
import UserActions from "./user_actions_menu";
import NotificationBell from "./notification_bell";

export default function TopBar({ setNotificationWindowOpen }: TopBarProps) {
  return (
    <div className="w-full flex items-center justify-between bg-white px-6 py-3 shadow-md">
      <h1 className="text-xl font-semibold text-gray-500">Dashboard</h1>

      <div className="flex items-center gap-2 text-gray-700">
        <NotificationBell setOpen={setNotificationWindowOpen} />
        <UserActions />
      </div>
    </div>
  );
}

interface TopBarProps {
  setNotificationWindowOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
