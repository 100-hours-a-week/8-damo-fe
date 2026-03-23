"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { socketManager } from "@/src/lib/websocket/socket-manager";
import { OutboxQueueService } from "@/src/lib/lightning/chat/outbox-queue-service";
import { generateClientMessageId } from "@/src/lib/lightning/chat/generate-client-message-id";
import type {
  ChatBroadcastMessage,
  ChatMessageRequest,
  OutboxMessage,
} from "@/src/types/chat";
import type { User } from "@/src/stores/user-store";

interface UseLightningChatOutboxOptions {
  lightningId: string;
  user: User | null;
}

const EMPTY_OUTBOX: OutboxMessage[] = [];

export function useLightningChatOutbox({
  lightningId,
  user,
}: UseLightningChatOutboxOptions) {
  const outboxRef = useRef<OutboxQueueService | null>(null);
  const userRef = useRef(user);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    const outbox = new OutboxQueueService({
      publishFn: (lid, body) => {
        socketManager.publish(`/pub/message/${lid}`, body);
      },
      isPublishable: () => socketManager.isPublishable(),
    });

    outboxRef.current = outbox;

    const removeListener = socketManager.addReconnectListener(() => {
      outbox.tryFlush();
    });

    return () => {
      removeListener();
      outbox.clear();
      outboxRef.current = null;
    };
  }, [lightningId]);

  const outboxMessages = useSyncExternalStore(
    useCallback(
      (onStoreChange: () => void) => {
        const outbox = outboxRef.current;
        if (!outbox) return () => {};
        return outbox.subscribe(onStoreChange);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [outboxRef.current]
    ),
    useCallback(() => {
      return outboxRef.current?.getSnapshot() ?? EMPTY_OUTBOX;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [outboxRef.current])
  );

  const sendOptimisticMessage = useCallback(
    (content: string) => {
      const currentUser = userRef.current;
      if (!currentUser) return;

      const trimmed = content.trim();
      if (!trimmed) return;

      const clientMessageId = generateClientMessageId(
        lightningId,
        currentUser.userId
      );
      const createdAt = new Date().toISOString();

      const displayMessage: ChatBroadcastMessage = {
        messageId: clientMessageId,
        senderId: currentUser.userId,
        lightningId,
        chatType: "TEXT",
        content: trimmed,
        createdAt,
        senderNickname: currentUser.nickname ?? undefined,
        senderImagePath: currentUser.imagePath,
        unreadCount: 0,
        clientMessageId,
      };

      const body: ChatMessageRequest = {
        chatType: "TEXT",
        content: trimmed,
        clientMessageId,
      };

      const item: OutboxMessage = {
        clientMessageId,
        lightningId,
        body,
        displayMessage,
        status: "pending",
        retryCount: 0,
        enqueuedAt: Date.now(),
      };

      outboxRef.current?.enqueue(item);
    },
    [lightningId]
  );

  const acknowledgeEcho = useCallback(
    (clientMessageId: string): boolean => {
      return outboxRef.current?.acknowledgeEcho(clientMessageId) ?? false;
    },
    []
  );

  const retryMessage = useCallback((clientMessageId: string) => {
    outboxRef.current?.retry(clientMessageId);
  }, []);

  const cancelMessage = useCallback((clientMessageId: string) => {
    outboxRef.current?.cancel(clientMessageId);
  }, []);

  return {
    outboxMessages,
    sendOptimisticMessage,
    acknowledgeEcho,
    retryMessage,
    cancelMessage,
  };
}
