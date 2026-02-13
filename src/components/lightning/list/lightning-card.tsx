import Link from "next/link";
import { Calendar, MapPin, Users } from "lucide-react";
import type { LightningItem } from "@/src/types/lightning";
import { cn } from "@/src/lib/utils";

export function LightningCard({ item }: { item: LightningItem }) {
  const isFull = item.participantsCount >= item.maxParticipants;
  const participationRate =
    item.maxParticipants > 0
      ? Math.min(100, Math.round((item.participantsCount / item.maxParticipants) * 100))
      : 0;
  const remainingSeats = Math.max(0, item.maxParticipants - item.participantsCount);

  return (
    <Link
      href={`/lightning/${item.id}`}
      className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff8d28] focus-visible:ring-offset-2"
    >
      <article className="rounded-2xl border border-[#d1d1d6] bg-white px-4 py-4 shadow-[0_2px_10px_rgba(17,17,17,0.05)] transition active:scale-[0.99] active:shadow-sm sm:px-5 sm:py-5">
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-semibold",
              isFull ? "bg-[#ffe5e5] text-[#b42318]" : "bg-[#fff1e5] text-[#b54708]"
            )}
          >
            {isFull ? "모집 마감" : "모집 중"}
          </span>
        </div>

        <h3 className="mt-3 line-clamp-2 text-base font-bold leading-6 text-[#111111] sm:text-lg sm:leading-7">
          {item.description}
        </h3>

        <div className="mt-3 flex flex-col gap-2 text-[#475467]">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex size-6 items-center justify-center rounded-full bg-[#f2f4f7]">
              <Calendar className="size-3.5 shrink-0 text-[#667085]" />
            </span>
            <span className="text-sm font-medium leading-6 sm:text-base">{item.dateLabel}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="inline-flex size-6 items-center justify-center rounded-full bg-[#f2f4f7]">
              <MapPin className="size-3.5 shrink-0 text-[#667085]" />
            </span>
            <span className="truncate text-sm font-medium leading-6 sm:text-base">
              {item.restaurantName}
            </span>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-[#f8f8fa] px-3 py-2.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[#344054]">
              <Users className="size-4 shrink-0" />
              <span className="text-sm font-semibold leading-6 sm:text-base">
                {item.participantsCount}/{item.maxParticipants}명
              </span>
            </div>
            <span className="text-xs font-semibold text-[#667085]">
              {isFull ? "정원 마감" : `남은 ${remainingSeats}자리`}
            </span>
          </div>

          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#e4e7ec]">
            <div
              className={cn("h-full rounded-full transition-all", isFull ? "bg-[#f04438]" : "bg-[#ff8d28]")}
              style={{ width: `${participationRate}%` }}
            />
          </div>
        </div>
      </article>
    </Link>
  );
}
