export type ChatType = "TEXT" | "JOIN" | "LEAVE";

export type WsEventType = "CHAT_MESSAGE" | "UNREAD_UPDATE";

export interface ChatBroadcastMessagePayload {
  messageId: number;
  senderId: number;
  lightningId: number;
  chatType: ChatType;
  content: string;
  createdAt: string;
  senderNickname: string | undefined;
  senderImagePath?: string | null;
  unreadCount: number;
  clientMessageId?: string;
}

export interface UpdateUnreadCountEventPayload {
  userId: number;
  lightningId: number;
  startChatMessageId: number;
  endChatMessageId: number;
}

export type WsEventMessage =
  | {
      type: "CHAT_MESSAGE";
      lightningId: number;
      payload: ChatBroadcastMessagePayload;
    }
  | {
      type: "UNREAD_UPDATE";
      lightningId: number;
      payload: UpdateUnreadCountEventPayload;
    };

export interface ChatMessageRequest {
  chatType: ChatType;
  content: string;
  clientMessageId?: string;
}

export interface ChatBroadcastMessage {
  messageId: string;
  senderId: string;
  lightningId: string;
  chatType: ChatType;
  content: string;
  createdAt: string;
  senderNickname: string | undefined;
  senderImagePath?: string | null;
  unreadCount: number;
  clientMessageId?: string;
}

export type OutboxMessageStatus = "pending" | "sending" | "failed";

export interface OutboxMessage {
  clientMessageId: string;
  lightningId: string;
  body: ChatMessageRequest;
  displayMessage: ChatBroadcastMessage;
  status: OutboxMessageStatus;
  retryCount: number;
  enqueuedAt: number;
}

export type ChatConnectionState =
  | "idle"
  | "connecting"
  | "connected"
  | "error"
  | "disconnected";
