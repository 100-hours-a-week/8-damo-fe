  import type { IMessage, StompSubscription } from "@stomp/stompjs";

  export type SubscriptionKey = "chat-list" | `chat-room-${string}`;

  export type MessageHandler = (message: IMessage) => void;

  export interface SubscriptionDef {
    destination: string;
    handler: MessageHandler;
    id: string;
    sub?: StompSubscription;
    generation: number;
  }