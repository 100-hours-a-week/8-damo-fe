"use client";

import { startTransition, useEffect, useRef } from "react";
import type { QueryClient } from "@tanstack/react-query";
import { appendChatMessagesToCache } from "@/src/lib/lightning/chat/append-chat-messages-to-cache";
import { MessageQueueService } from "@/src/lib/lightning/chat/message-queue-service";
import type { ChatBroadcastMessage } from "@/src/types/chat";

interface UseLightningChatIncomingQueueOptions {
  lightningId: string;
  queryClient: QueryClient;
  onMessagesFlushed?: (messageIds: string[]) => void;
}

export function useLightningChatIncomingQueue({
  lightningId,
  queryClient,
  onMessagesFlushed,
}: UseLightningChatIncomingQueueOptions) {
  const queueRef = useRef<MessageQueueService | null>(null);
  const flushListenerRef = useRef(onMessagesFlushed);
  const runtimeRef = useRef({
    lightningId,
    queryClient,
  });

  useEffect(() => {
    flushListenerRef.current = onMessagesFlushed;
    runtimeRef.current = {
      lightningId,
      queryClient,
    };
  }, [lightningId, onMessagesFlushed, queryClient]);

  useEffect(() => {
    const queue = new MessageQueueService({
      onDrain: (messages) => {
        startTransition(() => {
          appendChatMessagesToCache(
            runtimeRef.current.queryClient,
            runtimeRef.current.lightningId,
            messages
          );
          flushListenerRef.current?.(
            messages.map((message) => String(message.messageId))
          );
        });
      },
    });

    queueRef.current = queue;

    return () => {
      queue.stop();
      queue.clear();
      queueRef.current = null;
    };
  }, []);

  return {
    enqueueIncomingMessage: (message: ChatBroadcastMessage) => {
      queueRef.current?.enqueue(message);
    },
  };
}
