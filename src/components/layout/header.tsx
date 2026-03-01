"use client";

import { ArrowLeft, Bell, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/src/lib/utils";
import { Button } from "../ui/button";

interface HeaderProps {
  title?: React.ReactNode;
  onBack?: () => void;
  showBackButton?: boolean;
  showMoreButton?: boolean;
  showAlarmButton?: boolean;
  onMoreClick?: () => void;
  rightElement?: React.ReactNode;
  className?: string;
}

export function Header({
  title,
  onBack,
  showBackButton = true,
  showMoreButton = false,
  showAlarmButton = false,
  onMoreClick,
  rightElement,
  className,
}: HeaderProps) {
  const router = useRouter();

  const handleMoreClick = () => {
    if (onMoreClick) {
      onMoreClick();
    } else if (showAlarmButton) {
      router.push("/notifications");
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex h-14 min-h-14 w-full items-center justify-between bg-background px-2 sm:h-16 sm:min-h-16",
        className
      )}
    >
      {/* 왼쪽: 뒤로가기 버튼 */}
      <div className="shrink-0">
        {showBackButton ? (
          <Button
            variant="ghost"
            size="icon"
            className="sm:size-10"
            onClick={handleBack}
            aria-label="뒤로 가기"
          >
            <ArrowLeft className="size-6 text-[#8e8e93]" />
          </Button>
        ) : (
          <div className="size-9 sm:size-10" />
        )}
      </div>

      {/* 가운데: 제목 */}
      {title && (
        <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold leading-8 text-[#333] sm:text-xl">
          {title}
        </h1>
      )}

      {/* 오른쪽: 더보기 버튼 또는 커스텀 요소 */}
      <div className="shrink-0">
        {rightElement ? (
          rightElement
        ) : showMoreButton ? (
          <Button
            variant="ghost"
            size="icon"
            className="sm:size-10"
            onClick={handleMoreClick}
            aria-label={showAlarmButton ? "알림" : "더보기"}
          >
            {showAlarmButton ? (
              <Bell className="size-5 sm:size-6 text-muted-foreground" />
            ) : (
              <MoreVertical className="size-5 sm:size-6" />
            )}
          </Button>
        ) : (
          <div className="size-9 sm:size-10" />
        )}
      </div>
    </header>
  );
}
