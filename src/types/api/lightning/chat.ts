import type { ChatBroadcastMessage, ChatType } from "@/src/types/chat";

export type ChatDirection = "PREV" | "NEXT" | null;
export type ChatInitialScrollMode = "TOP" | "CENTER" | "BOTTOM" | "NONE";

export interface ChatPageParam {
  direction: ChatDirection;
  cursorId: string | null;
  size: number;
}

export interface ChatReadBoundary {
  showDivider: boolean;
  lastReadMessageId: number | null;
  firstUnreadMessageId: number | null;
}

export interface ChatPageInfo {
  previousPageParam: ChatPageParam | null;
  nextPageParam: ChatPageParam | null;
}

export interface ChatMessagePageResponse {
  messages: ChatBroadcastMessage[];
  pageInfo: ChatPageInfo;
  anchorCursor: number;
  initialScrollMode: ChatInitialScrollMode;
  readBoundary: ChatReadBoundary | null;
}

export interface ChatMessageRaw {
  messageId: number | string;
  senderId: number | string;
  lightningId: number | string;
  chatType: ChatType;
  content: string;
  createdAt: string;
  unreadCount: number;
}

export interface ChatPageParamRaw {
  direction: ChatDirection;
  cursorId: string | null;
  size: number;
}

export interface ChatReadBoundaryRaw {
  showDivider: boolean;
  lastReadMessageId: number | string | null;
  firstUnreadMessageId: number | string | null;
}

export interface ChatMessagePageRaw {
  messages: ChatMessageRaw[];
  pageInfo?: {
    previousPageParam?: ChatPageParamRaw | null;
    nextPageParam?: ChatPageParamRaw | null;
  };
  anchorCursor: number | string;
  initialScrollMode?: ChatInitialScrollMode;
  readBoundary?: ChatReadBoundaryRaw | null;
}

export interface GetLightningChatMessagesParams {
  lightningId: string;
  direction?: ChatDirection;
  cursorId?: string | null;
  size?: number;
}