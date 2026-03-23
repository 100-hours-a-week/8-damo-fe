"use client";

import { useRef, useCallback } from "react";
import type { Virtualizer } from "@tanstack/react-virtual";
import type { ChatInitialScrollMode } from "@/src/types/api/lightning/chat";
import type { ChatBroadcastMessage } from "@/src/types/chat";
import { useLightningChatAutoFollow } from "@/src/hooks/lightning/chat/use-lightning-chat-auto-follow";
import { useLightningChatPaginationScroll } from "@/src/hooks/lightning/chat/use-lightning-chat-pagination-scroll";

export function useChatScrollController({
  scrollRoot,
  messagesLength,
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
  messages,
}: {
  scrollRoot: HTMLDivElement | null;
  messagesLength: number;
  initialScrollMode: ChatInitialScrollMode;
  anchorCursor: string | null;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  isFetchingPreviousPage: boolean;
  isFetchingNextPage: boolean;
  fetchPreviousPage: () => Promise<unknown>;
  fetchNextPage: () => Promise<unknown>;
  markInitialized: () => void;
  topInView: boolean;
  bottomInView: boolean;
  lastChatMessageId: string | null;
  lastMessageElement: HTMLDivElement | null;
  virtualizer: Virtualizer<HTMLDivElement, Element> | null;
  messages: ChatBroadcastMessage[];
}) {
  const initialLoadDoneRef = useRef(false);
  const userScrolledRef = useRef(false);
  const centerPreloadRef = useRef(false);

  const scrollToAnchor = useCallback(
    (root: HTMLDivElement): number | null => {
      if (!virtualizer || !anchorCursor) return null;
      const anchorIndex = messages.findIndex(
        (m) => String(m.messageId) === anchorCursor
      );
      if (anchorIndex === -1) return null;

      virtualizer.scrollToIndex(anchorIndex, { align: "start" });

      requestAnimationFrame(() => {
        root.scrollBy({ top: -root.clientHeight * 0.25 });
      });

      return anchorIndex;
    },
    [anchorCursor, messages, virtualizer]
  );

  const {
    hasPendingIncomingMessage,
    isBottomOutOfView,
    scrollToBottom,
    setAutoFollowEnabled,
    shouldAutoFollowRef,
  } = useLightningChatAutoFollow({
    scrollRoot,
    bottomInView,
    lastChatMessageId,
    lastMessageElement,
    initialScrollMode,
    onUserScroll: () => {
      userScrolledRef.current = true;
    },
  });

  const scrollToLatestMessage = useCallback(() => {
    if (!scrollRoot) return;

    shouldAutoFollowRef.current = true;
    setAutoFollowEnabled(true);

    if (!virtualizer || messages.length === 0) {
      scrollToBottom();
      return;
    }

    const lastIndex = messages.length - 1;
    virtualizer.scrollToIndex(lastIndex, { align: "end" });

    requestAnimationFrame(() => {
      virtualizer.scrollToIndex(lastIndex, { align: "end" });
    });
  }, [
    messages.length,
    scrollRoot,
    scrollToBottom,
    setAutoFollowEnabled,
    shouldAutoFollowRef,
    virtualizer,
  ]);

  useLightningChatPaginationScroll({
    scrollRoot,
    messagesLength,
    initialScrollMode,
    hasPreviousPage,
    hasNextPage,
    isFetchingPreviousPage,
    isFetchingNextPage,
    fetchPreviousPage,
    fetchNextPage,
    markInitialized,
    topInView,
    bottomInView,
    initialLoadDoneRef,
    userScrolledRef,
    centerPreloadRef,
    scrollToAnchor,
    setAutoFollowEnabled,
  });

  return {
    hasPendingIncomingMessage,
    isBottomOutOfView,
    scrollToBottom,
    scrollToLatestMessage,
    shouldAutoFollowRef,
  };
}
