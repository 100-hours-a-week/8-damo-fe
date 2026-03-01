import { Header } from "@/src/components/layout/header";
import { Notification } from "./notification-card";
import { NotificationsList } from "./notifications-list";
import { NotificationsReadButton } from "./notifications-read-button";

interface NotificationsPageContentProps {
  notifications: Notification[];
}

export function NotificationsPageContent({
  notifications,
}: NotificationsPageContentProps) {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="flex h-full flex-col">
      <Header title="알림" showBackButton={true} showMoreButton={false} />
      <div className="flex items-center justify-between border-b border-[#f0f0f0] px-4 py-3">
        <p className="text-sm text-[#333]">
          읽지 않은 알림{" "}
          <span className="font-semibold text-orange-500">{unreadCount}개</span>
        </p>
        <NotificationsReadButton />
      </div>
      <div className="flex-1 overflow-y-auto">
        <NotificationsList notifications={notifications} />
      </div>
    </div>
  );
}
