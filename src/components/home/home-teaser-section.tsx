import { cn } from "@/src/lib/utils";
import { Utensils, Vote, CalendarDays, Sparkles } from "lucide-react";

interface HomeTeaserSectionProps {
  className?: string;
}

export function HomeTeaserSection({ className }: HomeTeaserSectionProps) {
  return (
    <section
      className={cn(
        "w-full max-w-[430px] rounded-xl bg-muted px-5 py-6",
        className
      )}
    >
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="size-5 text-primary" aria-hidden />
        <h2 className="text-lg font-bold">Damo가 곧 도와줄게요</h2>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          준비 중
        </span>
      </div>

      {/* Description */}
      <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
        회식이 번거롭지 않도록,  
        취향부터 일정까지 한 번에 정리하는 기능들을 준비하고 있어요.
      </p>

      {/* Feature Preview */}
      <ul className="flex flex-col gap-3 text-sm">
        <li className="flex items-center gap-3">
          <Utensils className="size-4 text-muted-foreground" aria-hidden />
          <span>개인 취향 기반 식당 추천</span>
        </li>
        <li className="flex items-center gap-3">
          <Vote className="size-4 text-muted-foreground" aria-hidden />
          <span>투표로 회식 장소 결정</span>
        </li>
        <li className="flex items-center gap-3">
          <CalendarDays className="size-4 text-muted-foreground" aria-hidden />
          <span>회식 일정 및 번개 모임 관리</span>
        </li>
      </ul>
    </section>
  );
}
