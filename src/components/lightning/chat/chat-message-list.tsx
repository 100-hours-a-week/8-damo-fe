"use client";

import { ArrowDown } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import type { ChatBroadcastMessage } from "@/src/types/chat";
import type {
  ChatInitialScrollMode,
  ChatReadBoundary,
} from "@/src/types/api/lightning/chat";
import { useChatScrollController } from "@/src/hooks/lightning/chat/use-lightning-chat-scroll-controller";
import { Button } from "@/src/components/ui/button";
import { ChatMessageItem } from "./chat-message-item";

interface Props {
  messages: ChatBroadcastMessage[];
  currentUserId: string | null;
  readBoundary: ChatReadBoundary | null;
  initialScrollMode: ChatInitialScrollMode;
  anchorCursor: string | null;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  isFetchingPreviousPage: boolean;
  isFetchingNextPage: boolean;
  fetchPreviousPage: () => Promise<unknown>;
  fetchNextPage: () => Promise<unknown>;
  markInitialized: () => void;
  lastChatMessageId: string | null;
}

const INVIEW_MARGIN = "15% 0px 15% 0px";

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
  markInitialized,
  lastChatMessageId,
}: Props) {
  const [scrollRoot, setScrollRoot] =
    useState<HTMLDivElement | null>(null);
  const [hasPendingIncomingMessage, setHasPendingIncomingMessage] = useState(false);
  const observedChatMessageIdRef = useRef<string | null>(null);

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
      threshold: 0.3,
    });

  const { ref: bottomSentinelRef, inView: bottomInView } =
    useInView({
      root: scrollRoot,
      rootMargin: INVIEW_MARGIN,
      threshold: 0.3,
    });

  const { scrollToBottom } = useChatScrollController({
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
    markInitialized,
    topInView,
    bottomInView,
    lastChatMessageId,
  });

  useEffect(() => {
    if (!lastChatMessageId) return;

    if (observedChatMessageIdRef.current === null) {
      observedChatMessageIdRef.current = lastChatMessageId;
      return;
    }

    if (observedChatMessageIdRef.current === lastChatMessageId) return;
    observedChatMessageIdRef.current = lastChatMessageId;

    if (bottomInView) return;

    const frame = requestAnimationFrame(() => {
      setHasPendingIncomingMessage(true);
    });

    return () => cancelAnimationFrame(frame);
  }, [bottomInView, lastChatMessageId]);

  useEffect(() => {
    if (!bottomInView) return;
    if (!hasPendingIncomingMessage) return;

    const frame = requestAnimationFrame(() => {
      setHasPendingIncomingMessage(false);
    });

    return () => cancelAnimationFrame(frame);
  }, [bottomInView, hasPendingIncomingMessage]);

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
    <div className="relative flex-1 overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-7 bg-gradient-to-b from-background/80 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 bg-gradient-to-t from-background/80 to-transparent" />

      <section
        ref={setScrollRootRef}
        className="h-full overflow-y-auto bg-card px-4 py-4"
      >
        <div ref={topSentinelRef} className="h-px w-full" />

        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <div className="rounded-2xl border border-border/70 bg-background/75 px-5 py-4 text-center shadow-xs">
              <p className="text-sm font-semibold text-foreground">
                아직 대화가 없어요
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                첫 메시지를 보내보세요
              </p>
            </div>
          </div>
        )}

        {messages.length > 0 && (
          <ul className="space-y-4 pb-2">
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

      {hasPendingIncomingMessage && messages.length > 0 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex justify-end px-4">
          <Button
            type="button"
            onClick={scrollToBottom}
            className="
              pointer-events-auto
              h-9 w-9
              rounded-full
              border border-border/70
              bg-background/85
              shadow-sm
              backdrop-blur
              flex items-center justify-center
            "
          >
            <ArrowDown className="size-4 text-primary" />
          </Button>
        </div>
      )}
    </div>
  );
}
