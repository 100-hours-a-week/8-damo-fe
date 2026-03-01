"use client";

import { Button } from "../ui/button";

export function NotificationsReadButton() {
  const handleClick = async () => {
    console.log("onReadNotification clicked");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="px-0 text-sm font-semibold text-orange-500"
      onClick={handleClick}
    >
      모두 읽기
    </Button>
  );
}