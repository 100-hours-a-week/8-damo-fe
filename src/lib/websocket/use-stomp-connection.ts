"use client"

import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { createStompClient } from "./create-stomp-client";
import { useStableEvent } from "@/src/hooks/use-stable-event";

interface UseStompConnectionOptions {
  accessToken: string | null;
  reconnectDelay?: number;
  onConnect?: (client: Client) => void;
  onDisconnect?: () => void;
  onError?: (error: unknown) => void;
}

export function useStompConnection({
  accessToken,
  reconnectDelay = 5000,
  onConnect,
  onDisconnect,
  onError,
}: UseStompConnectionOptions) {

  const BROKER_URL = process.env.NEXT_PUBLIC_API_URL;
  const clientRef = useRef<Client | null>(null);

  const stableOnConnect = useStableEvent(onConnect);
  const stableOnDisconnect = useStableEvent(onDisconnect);
  const stableOnError = useStableEvent(onError);

  useEffect(() => {
    if (!BROKER_URL || !accessToken) return;

    const client = createStompClient({
      brokerURL: BROKER_URL, 
      accessToken,
      reconnectDelay, 
      onConnect: stableOnConnect, 
      onDisconnect: stableOnDisconnect,
      onError: stableOnError
    });

    clientRef.current = client;
    client.activate();

    return () => {
      client.reconnectDelay = 0;
      client.deactivate();
      clientRef.current = null;
    };
  }, [accessToken]);

  return {
    clientRef
  };
}