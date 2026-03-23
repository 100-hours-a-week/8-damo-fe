import { ArrowLeft, Bell, MoreVertical } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Button } from "../ui/button";
import { HeaderAlarmButtonClient } from "./header-alarm-button-client";
import { HeaderBackButtonClient } from "./header-back-button-client";

interface HeaderProps {
  title?: React.ReactNode;
  onBack?: () => void;
  backPath?: string;
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
  backPath,
  showBackButton = true,
  showMoreButton = false,
  showAlarmButton = false,
  onMoreClick,
  rightElement,
  className,
}: HeaderProps) {
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
          onBack ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="sm:size-10"
              onClick={onBack}
              aria-label="뒤로 가기"
            >
              <ArrowLeft className="size-6 text-[#8e8e93]" />
            </Button>
          ) : (
            <HeaderBackButtonClient backPath={backPath} />
          )
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
          onMoreClick ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="sm:size-10"
              onClick={onMoreClick}
              aria-label={showAlarmButton ? "알림" : "더보기"}
            >
              {showAlarmButton ? (
                <Bell className="size-5 sm:size-6 text-muted-foreground" />
              ) : (
                <MoreVertical className="size-5 sm:size-6" />
              )}
            </Button>
          ) : showAlarmButton ? (
            <HeaderAlarmButtonClient />
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="sm:size-10"
              aria-label="더보기"
            >
              <MoreVertical className="size-5 sm:size-6" />
            </Button>
          )
        ) : (
          <div className="size-9 sm:size-10" />
        )}
      </div>
    </header>
  );
}
