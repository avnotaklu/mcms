import { PanelRightClose } from "lucide-react";
import NotificationList from "../dashboard/notifications/NotificationList";

export default function NotificationPanel({
  isOpen,
  setIsOpen,
}: NotificationPanelProps) {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out z-50 rounded-l-2xl p-6 flex flex-col`}
    >
      <div className="flex justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
        <button
          className="text-gray-500 hover:text-gray-800 transition"
          onClick={() => setIsOpen(false)}
        >
          <PanelRightClose />
        </button>
      </div>
      <NotificationList/>
    </div>
  );
}

interface NotificationPanelProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
