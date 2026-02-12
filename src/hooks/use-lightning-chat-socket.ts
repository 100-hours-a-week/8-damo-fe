import { useState, useEffect, useRef, useCallback } from "react";
import { ChatMessageRequest, ChatConnectionState, ChatBroadcastMessage } from "../types/chat";
import { IMessage, StompSubscription } from "@stomp/stompjs";
import { useStompConnection } from "../lib/websocket/use-stomp-connection";

interface UseLightningChatSocketOptions {
  lightningId: string;
  accessToken: string | null;
}

export function useLightningChatSocket({
  lightningId,
  accessToken,
}: UseLightningChatSocketOptions){
  const [state, setState] =
    useState<ChatConnectionState>("idle");
  const [error, setError] =
    useState<string | null>(null);
  const [messages, setMessages] =
    useState<ChatBroadcastMessage[]>([]);

  const subscriptionRef =
    useRef<StompSubscription | null>(null);

  const lightningIdRef = useRef(lightningId);
  useEffect(() => {lightningIdRef.current = lightningId}, [lightningId]);

  const { clientRef } = useStompConnection({
    accessToken,
    onConnect: () => {
      setState("connected");
      setError(null);
    },
    onDisconnect: () => {
      setState("disconnected");
    },
    onError: () => {
      setState("error");
      setError("채팅 연결에 실패했습니다.");
    },
  });

  const subscribeCurrentRoom = useCallback(() => {
    const client = clientRef.current;
    if (!client || !client.connected) return;

    subscriptionRef.current?.unsubscribe();
    subscriptionRef.current = null;

    const currentId = lightningIdRef.current;

    const sub = client.subscribe(
      `/sub/lightning/${currentId}`,
      (payload: IMessage) => {
        try {
          const parsed =
            JSON.parse(payload.body) as ChatBroadcastMessage;

          setMessages((prev) => [...prev, parsed]);
        } catch {
          setError("메시지를 읽지 못했습니다.");
        }
      }
    );

    subscriptionRef.current = sub;
  }, [clientRef]);

  useEffect(()=> {
    if (state === "connected"){
      subscribeCurrentRoom();
    }
  }, [lightningId, state, subscribeCurrentRoom]);

  const sendMessage = useCallback(
    (content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return;

      const client = clientRef.current;

      if (!client || !client.connected) {
        setError("연결 후 다시 시도해주세요.");
        return;
      }

      const body: ChatMessageRequest = {
        chatType: "TEXT",
        content: trimmed,
      };

      client.publish({
        destination: `/pub/message/${lightningId}`,
        body: JSON.stringify(body),
      });
    },
    [clientRef, lightningId]
  );
  
  useEffect(() => {
    return () => {
      subscriptionRef.current?.unsubscribe();
      subscriptionRef.current = null;
    };
  }, []);

  return {
    state, 
    error,
    messages,
    sendMessage
  };
}
