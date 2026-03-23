"use client";

import { useEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import type { ChatInitialScrollMode } from "@/src/types/api/lightning/chat";

interface UseLightningChatPaginationScrollOptions {
  scrollRoot: HTMLDivElement | null;
  messagesLength: number;
  initialScrollMode: ChatInitialScrollMode;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  isFetchingPreviousPage: boolean;
  isFetchingNextPage: boolean;
  fetchPreviousPage: () => Promise<unknown>;
  fetchNextPage: () => Promise<unknown>;
  markInitialized: () => void;
  topInView: boolean;
  bottomInView: boolean;
  initialLoadDoneRef: MutableRefObject<boolean>;
  userScrolledRef: MutableRefObject<boolean>;
  centerPreloadRef: MutableRefObject<boolean>;
  scrollToAnchor: (root: HTMLDivElement) => number | null;
  setAutoFollowEnabled: (enabled: boolean) => void;
}

export function useLightningChatPaginationScroll({
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
}: UseLightningChatPaginationScrollOptions) {
  const topFetchTriggeredRef = useRef(false);

  useEffect(() => {
    if (!scrollRoot || initialLoadDoneRef.current) return;
    if (messagesLength === 0) return;

    initialLoadDoneRef.current = true;

    requestAnimationFrame(() => {
      switch (initialScrollMode) {
        case "TOP":
          setAutoFollowEnabled(false);
          scrollRoot.scrollTo({ top: 0 });
          break;

        case "BOTTOM":
          setAutoFollowEnabled(true);
          scrollRoot.scrollTo({ top: scrollRoot.scrollHeight });
          break;

        case "CENTER": {
          setAutoFollowEnabled(false);
          const result = scrollToAnchor(scrollRoot);

          if (result === null) {
            scrollRoot.scrollTo({ top: 0 });
            centerPreloadRef.current = true;
          }
          break;
        }

        default:
          setAutoFollowEnabled(false);
      }

      markInitialized();
    });
  }, [
    centerPreloadRef,
    initialLoadDoneRef,
    initialScrollMode,
    markInitialized,
    messagesLength,
    scrollRoot,
    scrollToAnchor,
    setAutoFollowEnabled,
  ]);

  useEffect(() => {
    if (!scrollRoot) return;
    if (!initialLoadDoneRef.current) return;
    if (!userScrolledRef.current && !centerPreloadRef.current) return;
    if (!topInView) return;
    if (!hasPreviousPage) return;
    if (isFetchingPreviousPage) return;
    if (topFetchTriggeredRef.current) return;

    topFetchTriggeredRef.current = true;
    const beforeHeight = scrollRoot.scrollHeight;

    void fetchPreviousPage().then(() => {
      requestAnimationFrame(() => {
        if (centerPreloadRef.current && !userScrolledRef.current) {
          const targetIndex = scrollToAnchor(scrollRoot);

          if (targetIndex !== null) {
            centerPreloadRef.current = false;
          }
        } else {
          const delta = scrollRoot.scrollHeight - beforeHeight;
          scrollRoot.scrollTo({ top: scrollRoot.scrollTop + delta });
          centerPreloadRef.current = false;
        }

        topFetchTriggeredRef.current = false;
      });
    });
  }, [
    centerPreloadRef,
    fetchPreviousPage,
    hasPreviousPage,
    initialLoadDoneRef,
    isFetchingPreviousPage,
    scrollRoot,
    scrollToAnchor,
    topInView,
    userScrolledRef,
  ]);

  useEffect(() => {
    if (!initialLoadDoneRef.current) return;
    if (!userScrolledRef.current) return;
    if (!bottomInView) return;
    if (!hasNextPage) return;
    if (isFetchingNextPage) return;

    void fetchNextPage();
  }, [
    bottomInView,
    fetchNextPage,
    hasNextPage,
    initialLoadDoneRef,
    isFetchingNextPage,
    userScrolledRef,
  ]);
}
