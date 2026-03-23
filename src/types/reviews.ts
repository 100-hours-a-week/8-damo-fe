export interface ReviewSatisfaction {
  id: string;
  category: string;
}

export interface ReviewSummary {
  reviewId: string;
  diningId: string;
  groupName: string;
  restaurantName: string;
  starRating: number;
  satisfactions: ReviewSatisfaction[];
  createdAt: string;
}

export interface ReviewDetail extends ReviewSummary {
  content: string;
}
