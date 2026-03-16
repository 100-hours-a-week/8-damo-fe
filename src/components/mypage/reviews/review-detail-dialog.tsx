"use client";

import { AlertTriangle } from "lucide-react";
import { Dialog, DialogContent } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { useMyReview } from "@/src/hooks/reviews/use-my-review";
import { ReviewDetailContent } from "./review-detail-page-content";

interface ReviewDetailDialogProps {
  reviewId: string | null;
  onOpenChange: (open: boolean) => void;
}

export function ReviewDetailDialog({
  reviewId,
  onOpenChange,
}: ReviewDetailDialogProps) {
  const { data, isLoading, isError } = useMyReview(reviewId);

  function handleClose() {
    onOpenChange(false);
  }

  return (
    <Dialog open={!!reviewId} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[calc(100%-2rem)] sm:max-w-[360px] rounded-3xl p-0"
      >
        {isLoading && (
          <div className="space-y-0">
            <div className="flex items-center justify-between border-b border-[#f3f4f6] px-6 py-5">
              <div className="h-7 w-32 animate-pulse rounded-md bg-[#f3f4f6]" />
              <div className="size-8 animate-pulse rounded-full bg-[#f3f4f6]" />
            </div>
            <div className="space-y-6 px-6 py-6">
              <div className="space-y-3">
                <div className="h-7 w-40 animate-pulse rounded-md bg-[#f3f4f6]" />
                <div className="space-y-1">
                  <div className="h-5 w-24 animate-pulse rounded-md bg-[#f3f4f6]" />
                  <div className="h-4 w-20 animate-pulse rounded-md bg-[#f3f4f6]" />
                </div>
              </div>
              <div className="h-20 w-full animate-pulse rounded-2xl bg-[#f3f4f6]" />
              <div className="flex justify-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="size-9 animate-pulse rounded-full bg-[#f3f4f6]" />
                ))}
              </div>
            </div>
            <div className="border-t border-[#f3f4f6] px-6 py-4">
              <div className="h-12 w-full animate-pulse rounded-[14px] bg-[#f3f4f6]" />
            </div>
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center gap-4 px-6 py-10">
            <AlertTriangle className="size-10 text-[#ff8d28]" />
            <p className="text-center text-sm text-[#4a5565]">
              리뷰 상세를 불러오지 못했어요.
              <br />
              잠시 후 다시 시도해주세요.
            </p>
            <Button
              className="h-10 rounded-[14px] bg-[#ff8d28] px-6 text-sm font-medium text-white hover:bg-[#ff8d28]/90"
              onClick={handleClose}
            >
              닫기
            </Button>
          </div>
        )}

        {!isLoading && !isError && data?.data && (
          <ReviewDetailContent review={data.data} onClose={handleClose} />
        )}
      </DialogContent>
    </Dialog>
  );
}
