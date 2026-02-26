"use client"

import { useRef, useEffect, useState, useCallback } from "react";

import type {
  ChatInitialScrollMode,
} from "@/src/types/api/lightning/chat";

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
  topInView,
  bottomInView,
  lastChatMessageId,
}: {
  scrollRoot: HTMLDivElement | null;
  messagesLength: number;
  initialScrollMode: ChatInitialScrollMode;
  anchorCursor: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  isFetchingPreviousPage: boolean;
  isFetchingNextPage: boolean;
  fetchPreviousPage: () => Promise<unknown>;
  fetchNextPage: () => Promise<unknown>;
  topInView: boolean;
  bottomInView: boolean;
  lastChatMessageId: string | null;
}) {
  const initialLoadDoneRef = useRef(false);
  const handledChatMessageIdRef = useRef<string | null>(
    null
  );
  const fetchingPrevRef = useRef(false);
  const fetchingNextRef = useRef(false);
  const [isBottomOutOfView, setIsBottomOutOfView] =
    useState(false);

  const scrollToBottom = useCallback(() => {
    if (!scrollRoot) return;
    scrollRoot.scrollTo({
      top: scrollRoot.scrollHeight,
    });
    setIsBottomOutOfView(false);
  }, [scrollRoot]);

  // 1. 초기 스크롤
  useEffect(() => {
    if (!scrollRoot || initialLoadDoneRef.current) return;
    if (messagesLength === 0) return;

    requestAnimationFrame(() => {
      switch (initialScrollMode) {
        case "TOP":
          scrollRoot.scrollTo({ top: 0 });
          break;
        case "BOTTOM":
          scrollRoot.scrollTo({
            top: scrollRoot.scrollHeight,
          });
          break;
        case "CENTER": {
          const anchor = scrollRoot.querySelector<HTMLElement>(
            `[data-message-id="${anchorCursor}"]`
          );

          if (anchor) {
            const middle =
              anchor.offsetTop + anchor.offsetHeight / 2;
            scrollRoot.scrollTo({
              top: middle - scrollRoot.clientHeight / 2,
            });
          }
          break;
        }
      }

      initialLoadDoneRef.current = true;
      setIsBottomOutOfView(!bottomInView);
    });
  }, [
    scrollRoot,
    messagesLength,
    initialScrollMode,
    anchorCursor,
    bottomInView,
  ]);

  // 2. 위쪽 로딩
  useEffect(() => {
    if (!scrollRoot || !initialLoadDoneRef.current) return;
    if (!topInView || !hasPreviousPage) return;
    if (isFetchingPreviousPage || fetchingPrevRef.current) return;

    fetchingPrevRef.current = true;
    const beforeHeight = scrollRoot.scrollHeight;

    void fetchPreviousPage()
      .then(() => {
        requestAnimationFrame(() => {
          const delta =
            scrollRoot.scrollHeight - beforeHeight;
          scrollRoot.scrollTo({
            top: scrollRoot.scrollTop + delta,
          });
        });
      })
      .finally(() => {
        fetchingPrevRef.current = false;
      });
  }, [
    scrollRoot,
    topInView,
    hasPreviousPage,
    isFetchingPreviousPage,
    fetchPreviousPage,
  ]);

  // 3. 아래쪽 로딩
  useEffect(() => {
    if (!initialLoadDoneRef.current) return;
    if (!bottomInView || !hasNextPage) return;
    if (isFetchingNextPage || fetchingNextRef.current) return;

    fetchingNextRef.current = true;
    void fetchNextPage().finally(() => {
      fetchingNextRef.current = false;
    });
  }, [
    bottomInView,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  useEffect(() => {
    if (!initialLoadDoneRef.current) return;
    const frame = requestAnimationFrame(() => {
      setIsBottomOutOfView(!bottomInView);
    });

    return () => cancelAnimationFrame(frame);
  }, [bottomInView]);

  // 4. 실시간 CHAT_MESSAGE 이벤트에서만 자동 하단 이동
  useEffect(() => {
    if (!scrollRoot || !initialLoadDoneRef.current) return;
    if (!lastChatMessageId) return;
    if (handledChatMessageIdRef.current === lastChatMessageId) {
      return;
    }
    handledChatMessageIdRef.current = lastChatMessageId;
    if (!bottomInView) return;

    requestAnimationFrame(() => {
      scrollRoot.scrollTo({
        top: scrollRoot.scrollHeight,
      });
    });
  }, [bottomInView, lastChatMessageId, scrollRoot]);

  return {
    isBottomOutOfView,
    scrollToBottom,
  };
}
