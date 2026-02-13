"use client";

import { useCallback, useState } from "react";
import type { IMessage } from "@stomp/stompjs";
import type { ChatBroadcastMessage, ChatMessageRequest } from "@/src/types/chat";
import { socketManager } from "@/src/lib/websocket/socket-manager";
import { useChatRoomSubscription } from "@/src/lib/websocket/use-chat-room-subscription";

interface UseLightningChatSocketOptions {
  lightningId: string;
}

export function useLightningChatSocket({ lightningId }: UseLightningChatSocketOptions) {
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatBroadcastMessage[]>([]);

  const onMessage = useCallback((payload: IMessage) => {
    try {
      const parsed = JSON.parse(payload.body) as ChatBroadcastMessage;
      setMessages((prev) => [...prev, parsed]);
    } catch {
      setError("메시지를 읽지 못했습니다.");
    }
  }, []);

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
        socketManager.publish(`/pub/message/${lightningId}`, JSON.stringify(body));
        setError(null);
      } catch {
        setError("연결 후 다시 시도해주세요.");
      }
    },
    [lightningId]
  );

  return { error, messages, sendMessage };
}