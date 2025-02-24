import { NotificationProvider } from "@/app/context/NotificationContext"; // Correct Import

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NotificationProvider>{children}</NotificationProvider>;
}
