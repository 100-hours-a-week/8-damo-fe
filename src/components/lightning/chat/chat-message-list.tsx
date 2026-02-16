"use client";

import { useCallback, useState } from "react";
import { useInView } from "react-intersection-observer";
import type { ChatBroadcastMessage } from "@/src/types/chat";
import type {
  ChatInitialScrollMode,
  ChatReadBoundary,
} from "@/src/types/api/lightning/chat";
import { useChatScrollController } from "@/src/hooks/lightning/chat/use-lightning-chat-scroll-controller";
import { ChatMessageItem } from "./chat-message-item";

interface Props {
  messages: ChatBroadcastMessage[];
  currentUserId: string | null;
  readBoundary: ChatReadBoundary | null;
  initialScrollMode: ChatInitialScrollMode;
  anchorCursor: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  isFetchingPreviousPage: boolean;
  isFetchingNextPage: boolean;
  fetchPreviousPage: () => Promise<unknown>;
  fetchNextPage: () => Promise<unknown>;
}

const INVIEW_MARGIN = "120px 0px 120px 0px";

function isSameMessageId(
  messageId: string | number,
  targetMessageId: number | null | undefined
) {
  if (targetMessageId == null) return false;
  return Number(messageId) === targetMessageId;
}

export function ChatMessageList({
  messages,
  currentUserId,
  readBoundary,
  initialScrollMode,
  anchorCursor,
  hasPreviousPage,
  hasNextPage,
  isFetchingPreviousPage,
  isFetchingNextPage,
  fetchPreviousPage,
  fetchNextPage,
}: Props) {
  const [scrollRoot, setScrollRoot] =
    useState<HTMLDivElement | null>(null);

  const setScrollRootRef = useCallback(
    (node: HTMLDivElement | null) => {
      setScrollRoot(node);
    },
    []
  );

  const { ref: topSentinelRef, inView: topInView } =
    useInView({
      root: scrollRoot,
      rootMargin: INVIEW_MARGIN,
      threshold: 0,
    });

  const { ref: bottomSentinelRef, inView: bottomInView } =
    useInView({
      root: scrollRoot,
      rootMargin: INVIEW_MARGIN,
      threshold: 0,
    });

  useChatScrollController({
    scrollRoot,
    messagesLength: messages.length,
    initialScrollMode,
    anchorCursor,
    hasPreviousPage,
    hasNextPage,
    isFetchingPreviousPage,
    isFetchingNextPage,
    fetchPreviousPage,
    fetchNextPage,
    topInView,
    bottomInView,
  });

  const showDivider = readBoundary?.showDivider === true;
  const loadedMessageIds = new Set(
    messages.map((message) => Number(message.messageId))
  );
  const lastReadMessageId = showDivider
    ? readBoundary?.lastReadMessageId ?? null
    : null;
  const firstUnreadMessageId = showDivider
    ? readBoundary?.firstUnreadMessageId ?? null
    : null;
  const hasLastReadInLoadedMessages =
    lastReadMessageId !== null &&
    loadedMessageIds.has(lastReadMessageId);

  const dividerAfterMessageId = hasLastReadInLoadedMessages
    ? lastReadMessageId
    : null;

  const dividerBeforeMessageId =
    showDivider && !hasLastReadInLoadedMessages
      ? firstUnreadMessageId
      : null;

  return (
    <section
      ref={setScrollRootRef}
      className="flex-1 overflow-y-auto bg-card px-4 py-4"
    >
      <div ref={topSentinelRef} className="h-px w-full" />

      {messages.length === 0 && (
        <div className="flex h-full items-center justify-center">
          <p className="text-sm text-muted-foreground">
            첫 메시지를 보내보세요
          </p>
        </div>
      )}

      {messages.length > 0 && (
        <ul className="space-y-4">
          {messages.map((message) => (
            <ChatMessageItem
              key={message.messageId}
              message={message}
              currentUserId={currentUserId}
              showDividerBefore={isSameMessageId(
                message.messageId,
                dividerBeforeMessageId
              )}
              showDividerAfter={isSameMessageId(
                message.messageId,
                dividerAfterMessageId
              )}
            />
          ))}
        </ul>
      )}

      <div ref={bottomSentinelRef} className="h-px w-full" />
    </section>
  );
}
