  import { Client } from "@stomp/stompjs";

  interface CreateStompClientOptions {
    accessToken: string;
    reconnectDelay: number;
    onConnect: (client: Client) => void;
    onWebSocketClose: (evt: CloseEvent) => void;
    onStompError: (frame: unknown) => void;
    debug?: boolean;
  }

  export function createStompClient({
    accessToken,
    reconnectDelay,
    onConnect,
    onWebSocketClose,
    onStompError,
    debug = false,
  }: CreateStompClientOptions) {
    const brokerURL = process.env.NEXT_PUBLIC_BROKER_URL;
    const client = new Client({
      brokerURL,
      reconnectDelay,
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: debug ? (msg) => console.log("[STOMP]", msg) : undefined,
    });

    client.onConnect = () => onConnect(client);
    client.onWebSocketClose = (evt) => onWebSocketClose(evt);
    client.onStompError = (frame) => onStompError(frame);

    return client;
  }