"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyReview } from "@/src/lib/api/client/reviews";

export function useMyReview(reviewId: string | null) {
  return useQuery({
    queryKey: ["reviews", "my", reviewId],
    queryFn: () => getMyReview(reviewId!),
    enabled: !!reviewId,
    staleTime: Infinity,
    gcTime: 10 * 60_000
  });
}
