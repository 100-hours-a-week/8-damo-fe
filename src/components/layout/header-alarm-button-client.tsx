"use client";

import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export function HeaderAlarmButtonClient() {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="sm:size-10"
      onClick={() => router.push("/notifications")}
      aria-label="알림"
    >
      <Bell className="size-5 sm:size-6 text-muted-foreground" />
    </Button>
  );
}
