export interface RecommendationStreamMessage {
  eventId: string;
  userId: string;
  nickname: string;
  content: string;
  createdAt: string;
}

export type RecommendationHistoryResponse = RecommendationStreamMessage[];

export type RecommendationStreamStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "streaming"
  | "error"
  | "disconnected";
