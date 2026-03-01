import { cn } from "@/src/lib/utils";

export interface Notification {
  title: string;
  body: string;
  time: string;
  isRead: boolean;
}

interface NotificationCardProps {
  notification: Notification;
}

export function NotificationCard({ notification }: NotificationCardProps) {
  const { title, body, time, isRead } = notification;

  return (
    <div className={cn("px-4 py-4", !isRead && "bg-gray-50")}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="text-sm font-bold leading-snug text-[#333]">{title}</p>
          <p className="text-sm leading-snug text-[#666]">{body}</p>
          <p className="mt-1 text-xs text-[#999]">{time}</p>
        </div>
        {!isRead && (
          <div className="mt-1 size-2 shrink-0 rounded-full bg-orange-500" />
        )}
      </div>
    </div>
  );
}
