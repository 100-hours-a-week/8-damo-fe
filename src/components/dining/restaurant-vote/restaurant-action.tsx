import { ThumbsDown, ThumbsUp } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface RestaurantActionProps {
  likeCount: number;
  dislikeCount: number;
  onLike: () => void;
  onDislike: () => void;
  disabled?: boolean;
  isLiked?: boolean;
  isDisliked?: boolean;
}

export function RestaurantAction({
  likeCount,
  dislikeCount,
  onLike,
  onDislike,
  disabled = false,
  isLiked = false,
  isDisliked = false,
}: RestaurantActionProps) {
  return (
    <div className="flex w-full items-center gap-3">
      <button
        type="button"
        onClick={onLike}
        disabled={disabled}
        aria-pressed={isLiked}
        className={cn(
          "flex h-[50px] flex-1 items-center justify-center gap-2 rounded-[14px] border text-[16px] font-semibold leading-6 transition-colors",
          isLiked
            ? "border-[#ffedd4] bg-[#fff7ed] text-[#101828]"
            : "border-[#e5e7eb] bg-white text-[#101828]"
        )}
      >
        <ThumbsUp
          className="size-5"
          fill={isLiked ? "currentColor" : "none"}
          strokeWidth={isLiked ? 0 : 1.5}
        />
        <span>좋아요 {likeCount}</span>
      </button>
      <button
        type="button"
        onClick={onDislike}
        disabled={disabled}
        aria-pressed={isDisliked}
        className={cn(
          "flex h-[50px] flex-1 items-center justify-center gap-2 rounded-[14px] border text-[16px] font-semibold leading-6 transition-colors",
          isDisliked
            ? "border-[#ffedd4] bg-[#fff7ed] text-[#101828]"
            : "border-[#e5e7eb] bg-white text-[#101828]"
        )}
      >
        <ThumbsDown
          className="size-5"
          fill={isDisliked ? "currentColor" : "none"}
          strokeWidth={isDisliked ? 0 : 1.5}
        />
        <span>싫어요 {dislikeCount}</span>
      </button>
    </div>
  );
}
