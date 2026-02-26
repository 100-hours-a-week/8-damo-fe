"use client";

import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { ChatMessageRequest } from "@/src/types/chat";
import { useChatRoomSubscription } from "@/src/lib/websocket/use-chat-room-subscription";
import { publishChatMessage } from "@/src/lib/lightning/chat/publish-chat-message";
import { useLightningChatMessageHandler } from "@/src/hooks/lightning/chat/use-lightning-chat-message-handler";
import { getLightningChatMessagesQueryKey } from "@/src/hooks/lightning/chat/use-lightning-chat-infinite";
import { useUserStore } from "@/src/stores/user-store";

interface UseLightningChatSocketOptions {
  lightningId: string;
  enabled?: boolean;
  onChatMessage?: (messageId: string) => void;
}

export function useLightningChatSocket({
  lightningId,
  enabled = true,
  onChatMessage,
}: UseLightningChatSocketOptions) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const currentUserId = useUserStore((state) => {
    const value = Number(state.user?.userId);
    return Number.isFinite(value) ? value : null;
  });

  const onMessage = useLightningChatMessageHandler({
    lightningId,
    queryClient,
    setError,
    currentUserId,
    onChatMessage,
  });

  useChatRoomSubscription(lightningId, onMessage, enabled);

  useEffect(() => {
    return () => {
      queryClient.removeQueries({
        queryKey: getLightningChatMessagesQueryKey(lightningId),
        exact: true,
      });
    };
  }, [lightningId, queryClient]);

  const sendMessage = useCallback(
    (content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return;

      const body: ChatMessageRequest = {
        chatType: "TEXT",
        content: trimmed,
      };

      try {
        publishChatMessage(lightningId, body);
        setError(null);
      } catch {
        setError("연결 후 다시 시도해주세요.");
      }
    },
    [lightningId]
  );

  return { error, sendMessage };
}
