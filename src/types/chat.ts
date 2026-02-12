export type ChatType = "TEXT" | "JOIN" | "LEAVE";

export interface ChatMessageRequest {
  chatType: ChatType;
  content: string;
}

export interface ChatBroadcastMessage {
  messageId: string;
  senderId: string;
  lightningId: string;
  chatType: ChatType;
  content: string;
  createdAt: string;
}

export type ChatConnectionState =
  | "idle"
  | "connecting"
  | "connected"
  | "error"
  | "disconnected";
