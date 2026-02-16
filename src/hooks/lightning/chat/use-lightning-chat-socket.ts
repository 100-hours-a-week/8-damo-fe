"use client";

import { useCallback, useState } from "react";
import type { IMessage } from "@stomp/stompjs";
import { useQueryClient } from "@tanstack/react-query";
import type { ChatBroadcastMessage, ChatMessageRequest } from "@/src/types/chat";
import { useChatRoomSubscription } from "@/src/lib/websocket/use-chat-room-subscription";
import { appendChatMessageToCache } from "@/src/lib/lightning/chat/append-chat-message-to-cache";
import { publishChatMessage } from "@/src/lib/lightning/chat/publish-chat-message";

interface UseLightningChatSocketOptions {
  lightningId: string;
}

function normalizeSocketMessage(
  raw: Partial<ChatBroadcastMessage>,
  lightningId: string
): ChatBroadcastMessage {
  return {
    messageId: String(raw.messageId ?? Date.now()),
    senderId: String(raw.senderId ?? ""),
    lightningId: String(raw.lightningId ?? lightningId),
    chatType: raw.chatType ?? "TEXT",
    content: raw.content ?? "",
    createdAt: raw.createdAt ?? new Date().toISOString(),
  };
}

export function useLightningChatSocket({
  lightningId,
}: UseLightningChatSocketOptions) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const onMessage = useCallback(
    (payload: IMessage) => {
      try {
        const parsed = JSON.parse(payload.body) as Partial<ChatBroadcastMessage>;
        const incoming = normalizeSocketMessage(parsed, lightningId);

        appendChatMessageToCache(queryClient, lightningId, incoming);

        setError(null);
      } catch {
        setError("메시지를 읽지 못했습니다.");
      }
    },
    [lightningId, queryClient]
  );

  useChatRoomSubscription(lightningId, onMessage);

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