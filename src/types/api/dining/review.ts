export type DiningReviewSatisfactionTag =
  | "DELICIOUS_FOOD"
  | "ENJOYABLE_ATMOSPHERE"
  | "KIND_SERVICE"
  | "OPTIMAL_LOCATION"
  | "GROUP_COMPATIBILITY"
  | "DINING_SUCCESS";

export interface CreateDiningReviewRequest {
  starRating: number;
  satisfactionTags: DiningReviewSatisfactionTag[];
  content: string;
}
