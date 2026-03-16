import Link from "next/link";
import { Star } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import type { ReviewSummary } from "@/src/types/reviews";

const MAX_VISIBLE_SATISFACTIONS = 3;

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

function formatStarRating(starRating: number): string {
  if (!Number.isFinite(starRating)) {
    return "0";
  }

  return Number.isInteger(starRating) ? `${starRating}` : starRating.toFixed(1);
}

interface ReviewListItemProps {
  review: ReviewSummary;
}

export function ReviewListItem({ review }: ReviewListItemProps) {
  const visibleSatisfactions = review.satisfactions.slice(
    0,
    MAX_VISIBLE_SATISFACTIONS
  );
  const remainSatisfactionCount = Math.max(
    0,
    review.satisfactions.length - visibleSatisfactions.length
  );

  return (
    <Link
      href={`/mypage/review/${review.reviewId}`}
      className="block rounded-2xl bg-white p-4 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] transition-colors active:bg-[#f9fafb]"
      aria-label={`${review.restaurantName} 리뷰 상세 보기`}
    >
      <article className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <h2 className="line-clamp-1 text-base font-semibold leading-6 text-[#101828]">
            {review.restaurantName}
          </h2>
          <Badge className="h-7 shrink-0 gap-1 rounded-[10px] bg-[#fff7ed] px-2 text-sm font-semibold text-[#ff8d28]">
            <Star className="size-3.5 fill-[#ff8d28] stroke-[#ff8d28]" />
            {formatStarRating(review.starRating)}
          </Badge>
        </div>

        <div className="space-y-1">
          <p className="line-clamp-1 text-sm leading-5 text-[#4a5565]">
            {review.groupName}
          </p>
          <p className="text-xs leading-4 text-[#99a1af]">
            {formatReviewDate(review.createdAt)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {visibleSatisfactions.map((satisfaction) => (
            <Badge
              key={`${review.reviewId}-${satisfaction.id}-${satisfaction.category}`}
              className="h-6 rounded-full bg-[#f3f4f6] px-2 text-xs font-normal leading-4 text-[#4a5565]"
            >
              {satisfaction.category}
            </Badge>
          ))}
          {remainSatisfactionCount > 0 && (
            <Badge className="h-6 rounded-full bg-[#f3f4f6] px-2 text-xs font-normal leading-4 text-[#4a5565]">
              +{remainSatisfactionCount}
            </Badge>
          )}
        </div>
      </article>
    </Link>
  );
}
