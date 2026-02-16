"use client"

import { useRef, useEffect } from "react";

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
}) {
  const initialLoadDoneRef = useRef(false);
  const prevLengthRef = useRef(0);
  const fetchingPrevRef = useRef(false);
  const fetchingNextRef = useRef(false);

  // 1. 초기 스크롤
  useEffect(() => {
    if (!scrollRoot || initialLoadDoneRef.current) return;
    if (messagesLength === 0) return;

    requestAnimationFrame(() => {
      switch (initialScrollMode) {
        case "TOP":
          scrollRoot.scrollTop = 0;
          break;
        case "BOTTOM":
          scrollRoot.scrollTop = scrollRoot.scrollHeight;
          break;
        case "CENTER": {
          const anchor = scrollRoot.querySelector<HTMLElement>(
            `[data-message-id="${anchorCursor}"]`
          );

          if (anchor) {
            const middle =
              anchor.offsetTop + anchor.offsetHeight / 2;
            scrollRoot.scrollTop =
              middle - scrollRoot.clientHeight / 2;
          }
          break;
        }
      }

      initialLoadDoneRef.current = true;
      prevLengthRef.current = messagesLength;
    });
  }, [scrollRoot, messagesLength, initialScrollMode, anchorCursor]);

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
          scrollRoot.scrollTop += delta;
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

  // 4. 새 메시지 도착 시 자동 하단 이동
  useEffect(() => {
    if (!scrollRoot || !initialLoadDoneRef.current) return;

    const prevLength = prevLengthRef.current;
    if (messagesLength <= prevLength) {
      prevLengthRef.current = messagesLength;
      return;
    }

    const distanceToBottom =
      scrollRoot.scrollHeight -
      scrollRoot.scrollTop -
      scrollRoot.clientHeight;

    if (distanceToBottom <= 80) {
      requestAnimationFrame(() => {
        scrollRoot.scrollTop = scrollRoot.scrollHeight;
      });
    }

    prevLengthRef.current = messagesLength;
  }, [messagesLength, scrollRoot]);
}
