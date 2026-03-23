"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useChatRoomSubscription } from "@/src/lib/websocket/use-chat-room-subscription";
import { useLightningChatIncomingQueue } from "@/src/hooks/lightning/chat/use-lightning-chat-incoming-queue";
import { useLightningChatMessageHandler } from "@/src/hooks/lightning/chat/use-lightning-chat-message-handler";
import { getLightningChatMessagesQueryKey } from "@/src/hooks/lightning/chat/use-lightning-chat-infinite";
import { useUserStore } from "@/src/stores/user-store";

interface UseLightningChatSocketOptions {
  lightningId: string;
  enabled?: boolean;
  onChatMessage?: (messageId: string) => void;
  acknowledgeOutboxEcho?: (clientMessageId: string) => boolean;
}

export function useLightningChatSocket({
  lightningId,
  enabled = true,
  onChatMessage,
  acknowledgeOutboxEcho,
}: UseLightningChatSocketOptions) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const currentUserId = useUserStore((state) => {
    const value = Number(state.user?.userId);
    return Number.isFinite(value) ? value : null;
  });
  const { enqueueIncomingMessage } = useLightningChatIncomingQueue({
    lightningId,
    queryClient,
    onMessagesFlushed: (messageIds) => {
      messageIds.forEach((messageId) => onChatMessage?.(messageId));
    },
  });

  const onMessage = useLightningChatMessageHandler({
    lightningId,
    queryClient,
    setError,
    currentUserId,
    enqueueIncomingMessage,
    acknowledgeOutboxEcho,
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

  return { error };
}
