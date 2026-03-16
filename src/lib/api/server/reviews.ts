import "server-only";
import { serverGet } from "./index";
import type { ReviewDetail, ReviewSatisfaction, ReviewSummary } from "@/src/types/reviews";

interface ReviewSatisfactionRaw {
  id: string;
  category: string;
}

interface ReviewSummaryRaw {
  reviewId: string;
  diningId: string;
  groupName: string;
  restaurantName: string;
  starRating: number;
  satisfactions: ReviewSatisfactionRaw[] | null;
  createdAt: string;
}

interface ReviewDetailRaw extends ReviewSummaryRaw {
  content: string | null;
}

function mapSatisfactions(
  satisfactions: ReviewSatisfactionRaw[] | null | undefined
): ReviewSatisfaction[] {
  if (!Array.isArray(satisfactions)) {
    return [];
  }

  return satisfactions.map((item) => ({
    id: item.id,
    category: item.category ?? "",
  }));
}

function mapReviewSummary(raw: ReviewSummaryRaw): ReviewSummary {
  return {
    reviewId: raw.reviewId,
    diningId: raw.diningId,
    groupName: raw.groupName ?? "",
    restaurantName: raw.restaurantName ?? "",
    starRating: Number(raw.starRating),
    satisfactions: mapSatisfactions(raw.satisfactions),
    createdAt: raw.createdAt ?? "",
  };
}

function mapReviewDetail(raw: ReviewDetailRaw): ReviewDetail {
  return {
    ...mapReviewSummary(raw),
    content: raw.content ?? "",
  };
}

export async function getMyReviews(): Promise<ReviewSummary[]> {
  const data = await serverGet<ReviewSummaryRaw[] | null>(
    "/api/v1/users/me/reviews"
  );

  if (!Array.isArray(data)) {
    return [];
  }

  return data.map(mapReviewSummary);
}

export async function getMyReview(reviewId: string): Promise<ReviewDetail | null> {
  const data = await serverGet<ReviewDetailRaw | null>(
    `/api/v1/users/me/reviews/${encodeURIComponent(reviewId)}`
  );

  if (!data) {
    return null;
  }

  return mapReviewDetail(data);
}
