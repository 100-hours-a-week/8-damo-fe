"use client";

import { useEffect, useState } from "react";
import { getDiningRecommendationHistory } from "@/src/lib/api/client/dining";
import type { RecommendationStreamMessage } from "@/src/types/api/dining";

interface UseInitialMessagesParams {
  groupId: string;
  diningId: string;
  enabled: boolean;
}

export function dedupeByEventId(messages: RecommendationStreamMessage[]) {
  const seenIds = new Set<string>();
  return messages.filter((message) => {
    if (seenIds.has(message.eventId)) return false;
    seenIds.add(message.eventId);
    return true;
  });
}

export function mergeMessages(
  current: RecommendationStreamMessage[],
  newMessages: RecommendationStreamMessage[]
): RecommendationStreamMessage[] {
  const merged = [...current];
  const seenIds = new Set(merged.map((m) => m.eventId));

  for (const message of newMessages) {
    if (!seenIds.has(message.eventId)) {
      merged.push(message);
      seenIds.add(message.eventId);
    }
  }

  return merged;
}

export function appendMessage(
  current: RecommendationStreamMessage[],
  message: RecommendationStreamMessage
): RecommendationStreamMessage[] {
  const seenIds = new Set(current.map((m) => m.eventId));

  if (seenIds.has(message.eventId)) {
    return current;
  }

  return [...current, message];
}

export function useInitialMessages({
  groupId,
  diningId,
  enabled,
}: UseInitialMessagesParams): RecommendationStreamMessage[] {
  const [messages, setMessages] = useState<RecommendationStreamMessage[]>([]);

  useEffect(() => {
    if (!enabled || !groupId || !diningId) {
      return;
    }

    let cancelled = false;

    const loadHistory = async () => {
      try {
        const response = await getDiningRecommendationHistory({ groupId, diningId });
        if (cancelled) return;

        const historyMessages = dedupeByEventId(response.data);
        setMessages(historyMessages);
      } catch {
        if (cancelled) return;
      }
    };

    void loadHistory();

    return () => {
      cancelled = true;
    };
  }, [diningId, enabled, groupId]);

  return messages;
}
