"use client";

import { useCallback, useEffect, useReducer, useState } from "react";
import { connectDiningRecommendationStream } from "@/src/lib/api/client/dining-stream";
import { useStableEvent } from "@/src/hooks/use-stable-event";
import { recommendationStreamReducer } from "./use-dining-recommendation-stream.reducer";
import type {
  RecommendationStreamMessage,
  RecommendationStreamStatus,
} from "@/src/types/api/dining";

interface UseRecommendationConnectionParams {
  groupId: string;
  diningId: string;
  enabled: boolean;
  onMessage: (message: RecommendationStreamMessage) => void;
  onDone: () => void;
}

interface UseRecommendationConnectionResult {
  streamStatus: RecommendationStreamStatus;
  errorMessage: string | null;
  retryCount: number;
  reconnectSeed: number;
  reconnect: () => void;
}

export function useRecommendationConnection({
  groupId,
  diningId,
  enabled,
  onMessage,
  onDone,
}: UseRecommendationConnectionParams): UseRecommendationConnectionResult {
  const stableOnMessage = useStableEvent(onMessage);
  const stableOnDone = useStableEvent(onDone);

  const [streamStatus, dispatch] = useReducer(recommendationStreamReducer, "idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reconnectSeed, setReconnectSeed] = useState(0);

  const reconnect = useCallback(() => {
    setErrorMessage(null);
    setReconnectSeed((previous) => previous + 1);
  }, []);

  useEffect(() => {
    if (!enabled) {
      dispatch({ type: "CLOSE" });
      return;
    }

    let alive = true;
    let done = false;
    let closeStream: (() => void) | null = null;

    const stopStream = () => {
      if (!closeStream) return;
      closeStream();
      closeStream = null;
    };

    const start = () => {
      if (!alive || done) return;

      dispatch({ type: "CONNECT" });
      stopStream();

      closeStream = connectDiningRecommendationStream({
        groupId,
        diningId,
        onOpen: () => {
          if (!alive || done) return;
          setErrorMessage(null);
          dispatch({ type: "OPEN" });
        },
        onMessage: (message) => {
          if (!alive || done) return;
          stableOnMessage(message);
          dispatch({ type: "MESSAGE" });
        },
        onDone: () => {
          if (!alive || done) return;

          done = true;
          dispatch({ type: "CLOSE" });
          stableOnDone();
        },
        onError: (message) => {
          if (!alive || done) return;

          dispatch({ type: "ERROR" });
          setErrorMessage(message);
        },
      });
    };

    start();

    return () => {
      alive = false;
      done = true;
      stopStream();
      dispatch({ type: "CLOSE" });
    };
  }, [enabled, diningId, groupId, reconnectSeed, stableOnDone, stableOnMessage]);

  return {
    streamStatus,
    errorMessage,
    retryCount: 0,
    reconnectSeed,
    reconnect,
  };
}
