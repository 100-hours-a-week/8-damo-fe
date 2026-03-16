import { Star, X } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { DialogClose } from "@/src/components/ui/dialog";
import type { ReviewDetail } from "@/src/types/reviews";

function formatReviewDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

function getFilledStarCount(starRating: number): number {
  if (!Number.isFinite(starRating)) {
    return 0;
  }

  return Math.max(0, Math.min(5, Math.round(starRating)));
}

interface ReviewDetailContentProps {
  review: ReviewDetail;
  onClose: () => void;
}

export function ReviewDetailContent({
  review,
  onClose,
}: ReviewDetailContentProps) {
  const filledStarCount = getFilledStarCount(review.starRating);

  return (
    <>
      <header className="flex items-center justify-between border-b border-[#f3f4f6] px-6 py-5">
        <h2 className="text-xl font-semibold leading-7 text-[#101828]">
          리뷰 상세 내용
        </h2>
        <DialogClose asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-full text-[#667085] hover:bg-[#f3f4f6]"
            aria-label="닫기"
            onClick={onClose}
          >
            <X className="size-5" />
          </Button>
        </DialogClose>
      </header>

      <div className="space-y-6 px-6 py-6">
        <div className="space-y-3">
          <h3 className="text-[20px] font-bold leading-7 tracking-[-0.4492px] text-[#101828]">
            {review.restaurantName}
          </h3>
          <div className="space-y-1">
            <p className="text-sm leading-5 text-[#4a5565]">{review.groupName}</p>
            <p className="text-xs leading-4 text-[#99a1af]">
              {formatReviewDate(review.createdAt)}
            </p>
          </div>
        </div>

        {review.content && (
          <div className="rounded-2xl bg-[#f9fafb] p-4">
            <p className="whitespace-pre-wrap break-words text-sm leading-[22.75px] tracking-[-0.1504px] text-[#364153]">
              {review.content}
            </p>
          </div>
        )}
        
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={cn(
                "size-9",
                index < filledStarCount
                  ? "fill-[#fb923c] stroke-[#fb923c]"
                  : "fill-[#e5e7eb] stroke-[#d1d5db]"
              )}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {review.satisfactions.map((satisfaction) => (
            <Badge
              key={`${review.reviewId}-${satisfaction.id}-${satisfaction.category}`}
              className="h-[38px] rounded-[14px] border border-[#ffd6a8] bg-[#fff7ed] px-3 text-sm font-medium leading-5 text-[#ff8d28]"
            >
              {satisfaction.category}
            </Badge>
          ))}
        </div>
      </div>

      <footer className="border-t border-[#f3f4f6] px-6 py-4">
        <DialogClose asChild>
          <Button
            className="h-12 w-full rounded-[14px] bg-[#ff8d28] text-base font-medium text-white hover:bg-[#ff8d28]/90 active:bg-[#ff8d28]/90"
            onClick={onClose}
          >
            닫기
          </Button>
        </DialogClose>
      </footer>
    </>
  );
}
