"use client";

import { useDiningRecommendationStream } from "@/src/hooks/dining/use-dining-recommendation-stream";
import type { RecommendationStreamStatus } from "@/src/types/api/dining";
import { RecommendationPendingView } from "./recommendation-pending-view";
import type { RecommendationPendingViewState } from "./recommendation-pending-view.types";

interface RecommendationPendingSectionProps {
  groupId: string;
  diningId: string;
}

interface RecommendationPendingViewStateInput {
  streamStatus: RecommendationStreamStatus;
  messages: ReturnType<typeof useDiningRecommendationStream>["messages"];
  errorMessage: string | null;
  retryCount: number;
  isExpired: boolean;
}

type RecommendationUiStage =
  | "initializing"
  | "collecting"
  | "reconnecting"
  | "failed"
  | "completed";

interface NormalizedRecommendationState {
  stage: RecommendationUiStage;
  normalizedStatus: RecommendationStreamStatus;
  normalizedErrorMessage: string | null;
}

function assertNever(value: never): never {
  throw new Error(`Unhandled stream status: ${String(value)}`);
}

function dedupeMessages(
  messages: RecommendationPendingViewStateInput["messages"]
): RecommendationPendingViewStateInput["messages"] {
  const seenIds = new Set<string>();

  return messages.filter((message) => {
    if (seenIds.has(message.eventId)) return false;
    seenIds.add(message.eventId);
    return true;
  });
}

function normalizeRecommendationState({
  streamStatus,
  messages,
  errorMessage,
  isExpired,
}: RecommendationPendingViewStateInput): NormalizedRecommendationState {
  const hasMessages = messages.length > 0;
  const hasError = Boolean(errorMessage);

  if (streamStatus === "error" || isExpired) {
    return {
      stage: "failed",
      normalizedStatus: "error",
      normalizedErrorMessage: errorMessage,
    };
  }

  if (streamStatus === "streaming") {
    return {
      stage: "collecting",
      normalizedStatus: "streaming",
      normalizedErrorMessage: null,
    };
  }

  if (streamStatus === "disconnected") {
    if (hasMessages && !hasError) {
      return {
        stage: "completed",
        normalizedStatus: "streaming",
        normalizedErrorMessage: null,
      };
    }

    return {
      stage: "reconnecting",
      normalizedStatus: "connecting",
      normalizedErrorMessage: null,
    };
  }

  if (streamStatus === "connected" && hasMessages) {
    return {
      stage: "collecting",
      normalizedStatus: "streaming",
      normalizedErrorMessage: null,
    };
  }

  switch (streamStatus) {
    case "idle":
    case "connecting":
    case "connected":
      return {
        stage: "initializing",
        normalizedStatus: streamStatus,
        normalizedErrorMessage: null,
      };

    default:
      return assertNever(streamStatus);
  }
}

function toRecommendationPendingViewState({
  streamStatus,
  messages,
  errorMessage,
  retryCount,
  isExpired,
}: RecommendationPendingViewStateInput): RecommendationPendingViewState {
  const dedupedMessages = dedupeMessages(messages);
  const {
    stage,
    normalizedStatus,
    normalizedErrorMessage,
  } = normalizeRecommendationState({
    streamStatus,
    messages: dedupedMessages,
    errorMessage,
    retryCount,
    isExpired,
  });

  const normalizedRetryCount =
    stage === "reconnecting" || stage === "failed"
      ? Math.max(retryCount, 1)
      : retryCount;

  const stateBase = {
    retryCount: normalizedRetryCount,
    isExpired,
  };

  switch (normalizedStatus) {
    case "idle":
    case "connecting":
    case "connected":
    case "disconnected":
      return {
        type: normalizedStatus,
        ...stateBase,
      };

    case "streaming":
      return {
        type: "streaming",
        messages: dedupedMessages,
        ...stateBase,
      };

    case "error":
      return {
        type: "error",
        errorMessage: normalizedErrorMessage,
        ...stateBase,
      };

    default:
      return assertNever(normalizedStatus);
  }
}

export function RecommendationPendingSection({
  groupId,
  diningId,
}: RecommendationPendingSectionProps) {
  const {
    streamStatus,
    messages,
    errorMessage,
    retryCount,
    isExpired,
    reconnect,
  } = useDiningRecommendationStream({
    groupId,
    diningId,
    enabled: Boolean(groupId && diningId),
  });

  const viewState = toRecommendationPendingViewState({
    streamStatus,
    messages,
    errorMessage,
    retryCount,
    isExpired,
  });

  return (
    <RecommendationPendingView
      viewState={viewState}
      onReconnect={reconnect}
    />
  );
}
