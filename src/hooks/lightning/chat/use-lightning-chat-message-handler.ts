"use client";

import { useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { IMessage } from "@stomp/stompjs";
import type { QueryClient } from "@tanstack/react-query";
import { updateUnreadCountInCache } from "@/src/lib/lightning/chat/update-unread-count-in-cache";
import { appendChatMessagesToCache } from "@/src/lib/lightning/chat/append-chat-messages-to-cache";
import type {
  ChatBroadcastMessage,
  ChatBroadcastMessagePayload,
  WsEventMessage,
} from "@/src/types/chat";

interface UseLightningChatMessageHandlerOptions {
  lightningId: string;
  queryClient: QueryClient;
  setError: Dispatch<SetStateAction<string | null>>;
  currentUserId: number | null;
  enqueueIncomingMessage: (message: ChatBroadcastMessage) => void;
  acknowledgeOutboxEcho?: (clientMessageId: string) => boolean;
}

function normalizeSocketMessage(
  raw: Partial<ChatBroadcastMessagePayload>,
  lightningId: string
): ChatBroadcastMessage {
  const parsedUnreadCount = Number(raw.unreadCount);

  return {
    messageId: String(raw.messageId ?? Date.now()),
    senderId: String(raw.senderId ?? ""),
    lightningId: String(raw.lightningId ?? lightningId),
    chatType: raw.chatType ?? "TEXT",
    content: raw.content ?? "",
    createdAt: raw.createdAt ?? new Date().toISOString(),
    senderNickname: raw.senderNickname ?? "user",
    senderImagePath: raw.senderImagePath ?? null,
    unreadCount: Number.isFinite(parsedUnreadCount)
      ? parsedUnreadCount
      : 0,
    clientMessageId: raw.clientMessageId ?? undefined,
  };
}

export function useLightningChatMessageHandler({
  lightningId,
  queryClient,
  setError,
  currentUserId,
  enqueueIncomingMessage,
  acknowledgeOutboxEcho,
}: UseLightningChatMessageHandlerOptions) {
  return useCallback(
    (payload: IMessage) => {
      try {
        const parsed = JSON.parse(payload.body) as WsEventMessage;
        switch (parsed.type) {
          case "CHAT_MESSAGE": {
            const incoming = normalizeSocketMessage(parsed.payload, lightningId);
            if (process.env.NEXT_PUBLIC_APP_ENV !== "prod") {
              performance.mark(`chat:ws-received:${incoming.messageId}`);
            }
            console.log("[WS][CHAT_MESSAGE]", { incoming, });

            if (incoming.clientMessageId && acknowledgeOutboxEcho?.(incoming.clientMessageId)) {
              appendChatMessagesToCache(queryClient, lightningId, [incoming]);
              setError(null);
              return;
            }

            enqueueIncomingMessage(incoming);
            setError(null);
            return;
          }
          case "UNREAD_UPDATE": {
            console.log("[WS][UNREAD_UPDATE]", {
              lightningId: parsed.lightningId,
              payload: parsed.payload,
            });

            updateUnreadCountInCache(
              queryClient,
              lightningId,
              parsed.payload,
              currentUserId
            );
            setError(null);
            return;
          }
          default: {
            console.log("[WS][UNKNOWN_EVENT]", parsed);
            setError(null);
          }
        }
      } catch {
        setError("메시지를 읽지 못했습니다.");
      }
    },
    [acknowledgeOutboxEcho, currentUserId, enqueueIncomingMessage, lightningId, queryClient, setError]
  );
}
