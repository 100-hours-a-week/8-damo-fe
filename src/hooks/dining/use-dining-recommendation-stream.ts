"use client";

import { useCallback, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRecommendationConnection } from "./use-recommendation-connection";
import { useInitialMessages, mergeMessages, appendMessage as appendMessageUtil } from "./use-stream-messages";
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
  const initialMessages = useInitialMessages({ groupId, diningId, enabled });
  const [streamMessages, setStreamMessages] = useState<RecommendationStreamMessage[]>([]);

  const messages = useMemo(
    () => mergeMessages(initialMessages, streamMessages),
    [initialMessages, streamMessages]
  );

  const handleMessage = useCallback((message: RecommendationStreamMessage) => {
    setStreamMessages((prev) => appendMessageUtil(prev, message));
    return true;
  }, []);

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
    onMessage: handleMessage,
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
