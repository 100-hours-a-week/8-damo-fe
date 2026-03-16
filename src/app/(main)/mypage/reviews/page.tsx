import { ReviewsPageContent } from "@/src/components/mypage/reviews/reviews-page-content";
import { getMyReviews } from "@/src/lib/api/server/reviews";
import type { ReviewSummary } from "@/src/types/reviews";

export default async function MyReviewsPage() {
  let errorMessage: string | null = null;
  let reviews: ReviewSummary[] = [];

  try {
    reviews = await getMyReviews();
    console.log(reviews);
  } catch {
    errorMessage = "리뷰 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.";
  }

  return <ReviewsPageContent reviews={reviews} errorMessage={errorMessage} />;
}
