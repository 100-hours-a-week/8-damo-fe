import { Client } from "@stomp/stompjs";

interface CreateStompClientOptions {
  brokerURL: string;
  accessToken: string;
  reconnectDelay: number;
  onConnect: (client: Client) => void;
  onWebSocketClose: (evt: CloseEvent) => void;
  onStompError: (frame: unknown) => void;
  debug?: boolean;
}

export function createStompClient({
    brokerURL,
    accessToken,
    reconnectDelay,
    onConnect,
    onWebSocketClose,
    onStompError,
  debug = false,
}: CreateStompClientOptions) {
  const enableStompDebug =
    debug && process.env.NEXT_PUBLIC_ENV !== "prod";

  const client = new Client({
    brokerURL,
    reconnectDelay,
    connectHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    debug: enableStompDebug ? (msg) => console.log("[STOMP]", msg) : undefined,
  });

  client.onConnect = () => onConnect(client);
  client.onWebSocketClose = (evt) => onWebSocketClose(evt);
  client.onStompError = (frame) => onStompError(frame);

  return client;
}
