import { Notification, NotificationCard } from "./notification-card";

interface NotificationsListProps {
  notifications: Notification[];
}

export function NotificationsList({ notifications }: NotificationsListProps) {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <p className="text-sm text-[#999]">알림이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {notifications.map((notification, index) => (
        <div key={index}>
          <NotificationCard notification={notification} />
          {index < notifications.length - 1 && (
            <div className="h-px bg-[#f0f0f0]" />
          )}
        </div>
      ))}
    </div>
  );
}
