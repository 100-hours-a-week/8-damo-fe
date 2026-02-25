  "use client";

  import { useEffect } from "react";
  import type { IMessage } from "@stomp/stompjs";
  import { socketManager } from "@/src/lib/websocket/socket-manager";

  export function useChatRoomSubscription(
    lightningId: string,
    onMessage: (payload: IMessage) => void,
    enabled = true
  ) {
    useEffect(() => {
      if (!enabled) return;

      socketManager.subscribe(
        `chat-room-${lightningId}`,
        `/sub/lightning/${lightningId}`,
        onMessage,
      );

      return () => {
        socketManager.unsubscribe(`chat-room-${lightningId}`);
      };
    }, [enabled, lightningId, onMessage]);
  }
