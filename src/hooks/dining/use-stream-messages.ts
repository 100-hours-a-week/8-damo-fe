"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getDiningRecommendationHistory } from "@/src/lib/api/client/dining";
import type { RecommendationStreamMessage } from "@/src/types/api/dining";

interface UseStreamMessagesResult {
  messages: RecommendationStreamMessage[];
  appendMessage: (message: RecommendationStreamMessage) => boolean;
  resetMessages: () => void;
}

interface UseStreamMessagesParams {
  groupId: string;
  diningId: string;
  enabled: boolean;
}

function dedupeByEventId(messages: RecommendationStreamMessage[]) {
  const seenIds = new Set<string>();
  return messages.filter((message) => {
    if (seenIds.has(message.eventId)) return false;
    seenIds.add(message.eventId);
    return true;
  });
}

export function useStreamMessages({
  groupId,
  diningId,
  enabled,
}: UseStreamMessagesParams): UseStreamMessagesResult {
  const [messages, setMessages] = useState<RecommendationStreamMessage[]>([]);
  const receivedIdsRef = useRef(new Set<string>());

  const appendMessage = useCallback((message: RecommendationStreamMessage) => {
    if (receivedIdsRef.current.has(message.eventId)) {
      return false;
    }

    receivedIdsRef.current.add(message.eventId);
    setMessages((previous) => [...previous, message]);
    return true;
  }, []);

  const resetMessages = useCallback(() => {
    receivedIdsRef.current.clear();
    setMessages([]);
  }, []);

  useEffect(() => {
    if (!enabled || !groupId || !diningId) {
      resetMessages();
      return;
    }

    let cancelled = false;

    resetMessages();

    const initializeMessages = async () => {
      try {
        const response = await getDiningRecommendationHistory({ groupId, diningId });
        if (cancelled) return;

        const historyMessages = dedupeByEventId(response.data);

        setMessages((previous) => {
          const mergedMessages = [...historyMessages];
          const mergedIds = new Set(mergedMessages.map((message) => message.eventId));

          for (const message of previous) {
            if (mergedIds.has(message.eventId)) continue;
            mergedIds.add(message.eventId);
            mergedMessages.push(message);
          }

          receivedIdsRef.current = mergedIds;
          return mergedMessages;
        });
      } catch {
        if (cancelled) return;
        // Keep stream flow alive when history initialization fails.
      }
    };

    void initializeMessages();

    return () => {
      cancelled = true;
    };
  }, [diningId, enabled, groupId, resetMessages]);

  return {
    messages,
    appendMessage,
    resetMessages,
  };
}
