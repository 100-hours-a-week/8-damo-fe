"use client";

import { ArrowDown } from "lucide-react";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { ChatBroadcastMessage, OutboxMessage } from "@/src/types/chat";
import type {
  ChatInitialScrollMode,
  ChatReadBoundary,
} from "@/src/types/api/lightning/chat";
import { useChatScrollController } from "@/src/hooks/lightning/chat/use-lightning-chat-scroll-controller";
import { Button } from "@/src/components/ui/button";
import { ChatMessageItem } from "./chat-message-item";

interface Props {
  messages: ChatBroadcastMessage[];
  outboxMessages: OutboxMessage[];
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
  onRetry: (clientMessageId: string) => void;
  onCancel: (clientMessageId: string) => void;
}

const INVIEW_MARGIN = "15% 0px 15% 0px";

function isSameMessageId(
  messageId: string | number,
  targetMessageId: number | null | undefined
) {
  if (targetMessageId == null) return false;
  return Number(messageId) === targetMessageId;
}

export const ChatMessageList = memo(function ChatMessageList({
  messages,
  outboxMessages,
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
  onRetry,
  onCancel,
}: Props) {
  const scrollElementRef = useRef<HTMLDivElement | null>(null);
  const [scrollRoot, setScrollRoot] = useState<HTMLDivElement | null>(null);
  const [lastMessageElement, setLastMessageElement] =
    useState<HTMLDivElement | null>(null);

  const setScrollRootRef = useCallback(
    (node: HTMLDivElement | null) => {
      scrollElementRef.current = node;
      setScrollRoot(node);
    },
    []
  );

  const outboxStatusMap = useMemo(() => {
    const map = new Map<string, OutboxMessage>();
    for (const item of outboxMessages) {
      map.set(item.clientMessageId, item);
    }
    return map;
  }, [outboxMessages]);

  const allMessages = useMemo(() => {
    const outboxDisplayMessages = outboxMessages.map((item) => item.displayMessage);
    return [...messages, ...outboxDisplayMessages];
  }, [messages, outboxMessages]);

  const virtualizer = useVirtualizer({
    count: allMessages.length,
    getScrollElement: () => scrollElementRef.current,
    estimateSize: () => 80,
    overscan: 5,
    gap: 16,
  });

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

  const { hasPendingIncomingMessage, scrollToLatestMessage } = useChatScrollController({
    scrollRoot,
    messagesLength: allMessages.length,
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
    lastMessageElement,
    virtualizer,
    messages: allMessages,
  });

  const showDivider = readBoundary?.showDivider === true;
  const loadedMessageIds = useMemo(
    () => new Set(messages.map((message) => Number(message.messageId))),
    [messages]
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

        {allMessages.length === 0 && (
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

        {allMessages.length > 0 && (
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              position: "relative",
            }}
          >
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const message = allMessages[virtualRow.index];
              const isLastMessage = virtualRow.index === allMessages.length - 1;
              const outboxItem = message.clientMessageId
                ? outboxStatusMap.get(message.clientMessageId)
                : undefined;
              return (
                <div
                  key={virtualRow.key}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <div ref={isLastMessage ? setLastMessageElement : null}>
                    <ChatMessageItem
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
                      outboxStatus={outboxItem?.status}
                      onRetry={
                        outboxItem
                          ? () => onRetry(outboxItem.clientMessageId)
                          : undefined
                      }
                      onCancel={
                        outboxItem
                          ? () => onCancel(outboxItem.clientMessageId)
                          : undefined
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div ref={bottomSentinelRef} className="h-px w-full" />
      </section>

      {hasPendingIncomingMessage && allMessages.length > 0 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex justify-end px-4">
          <Button
            type="button"
            onClick={scrollToLatestMessage}
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
});
