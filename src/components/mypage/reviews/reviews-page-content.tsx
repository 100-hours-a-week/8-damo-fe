"use client";

import { useState } from "react";
import { AlertTriangle, MessageSquareText } from "lucide-react";
import { Header } from "@/src/components/layout";
import { EmptyState } from "@/src/components/ui/empty-state";
import type { ReviewSummary } from "@/src/types/reviews";
import { ReviewListItem } from "./review-list-item";
import { ReviewDetailDialog } from "./review-detail-dialog";

interface ReviewsPageContentProps {
  reviews: ReviewSummary[];
  errorMessage?: string | null;
}

export function ReviewsPageContent({
  reviews,
  errorMessage,
}: ReviewsPageContentProps) {
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);

  return (
    <div className="mx-auto flex min-h-dvh w-full min-w-[320px] max-w-[430px] flex-col bg-[#f9fafb]">
      <Header title="리뷰 관리" className="border-b border-[#e5e7eb] bg-white" />
      <main className="flex-1 overflow-y-auto px-5 pb-8 pt-4">
        {errorMessage ? (
          <EmptyState
            icon={AlertTriangle}
            title="리뷰 목록을 불러오지 못했어요"
            description={errorMessage}
            className="min-h-[calc(100dvh-56px)] sm:min-h-[calc(100dvh-64px)]"
          />
        ) : reviews.length === 0 ? (
          <EmptyState
            icon={MessageSquareText}
            title="작성한 리뷰가 없어요"
            description="참여한 회식의 리뷰를 작성하면 여기에서 확인할 수 있어요."
            className="min-h-[calc(100dvh-56px)] sm:min-h-[calc(100dvh-64px)]"
          />
        ) : (
          <section className="flex flex-col gap-3">
            {reviews.map((review) => (
              <ReviewListItem
                key={review.reviewId}
                review={review}
                onSelect={setSelectedReviewId}
              />
            ))}
          </section>
        )}
      </main>

      <ReviewDetailDialog
        reviewId={selectedReviewId}
        onOpenChange={(open) => {
          if (!open) setSelectedReviewId(null);
        }}
      />
    </div>
  );
}
