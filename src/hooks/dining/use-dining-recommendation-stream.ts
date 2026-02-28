"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRecommendationConnection } from "./use-recommendation-connection";
import { useStreamMessages } from "./use-stream-messages";
import type {
  RecommendationStreamMessage,
  RecommendationStreamStatus,
} from "@/src/types/api/dining";

interface UseDiningRecommendationStreamParams {
  groupId: string;
  diningId: string;
  enabled: boolean;
}

interface UseDiningRecommendationStreamResult {
  streamStatus: RecommendationStreamStatus;
  messages: RecommendationStreamMessage[];
  errorMessage: string | null;
}

export function useDiningRecommendationStream({
  groupId,
  diningId,
  enabled,
}: UseDiningRecommendationStreamParams): UseDiningRecommendationStreamResult {
  const queryClient = useQueryClient();

  const { messages, appendMessage } = useStreamMessages({
    groupId,
    diningId,
    enabled,
  });

  console.log(messages);

  const syncDiningQueries = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["dining", "detail", groupId, diningId, "common"],
      }),
      queryClient.invalidateQueries({
        queryKey: ["dining", "detail", groupId, diningId, "restaurant-vote"],
      }),
    ]);
  }, [diningId, groupId, queryClient]);

  const { streamStatus, errorMessage } = useRecommendationConnection({
    groupId,
    diningId,
    enabled,
    onMessage: appendMessage,
    onDone: () => {
      void syncDiningQueries();
    },
  });

  return {
    streamStatus,
    messages,
    errorMessage,
  };
}
