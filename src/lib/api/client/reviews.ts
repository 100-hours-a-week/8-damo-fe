import { bffGet, type ApiResponse } from "./index";
import type { ReviewDetail } from "@/src/types/reviews";

export async function getMyReview(
  reviewId: string
): Promise<ApiResponse<ReviewDetail>> {
  return bffGet<ReviewDetail>(`/users/me/reviews/${reviewId}`);
}
