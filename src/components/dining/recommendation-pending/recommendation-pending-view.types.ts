import type {
  RecommendationStreamMessage,
  RecommendationStreamStatus,
} from "@/src/types/api/dining";

interface RecommendationPendingViewStateBase {
  isExpired: boolean;
  retryCount: number;
}

export type RecommendationPendingViewState =
  | ({
      type: "idle" | "connecting" | "connected" | "disconnected";
    } & RecommendationPendingViewStateBase)
  | ({
      type: "streaming";
      messages: RecommendationStreamMessage[];
    } & RecommendationPendingViewStateBase)
  | ({
      type: "error";
      errorMessage: string | null;
    } & RecommendationPendingViewStateBase);

export interface RecommendationPendingStatusUi {
  label: string;
  description: string;
  panelKind: "waiting" | "streaming" | "error";
  tone: "normal" | "error";
}

export type RecommendationPendingStatusUiMap = Record<
  RecommendationStreamStatus,
  RecommendationPendingStatusUi
>;
