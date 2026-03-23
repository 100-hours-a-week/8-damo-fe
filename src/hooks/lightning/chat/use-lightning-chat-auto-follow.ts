"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatInitialScrollMode } from "@/src/types/api/lightning/chat";

const BOTTOM_FOLLOW_THRESHOLD_PX = 350;

interface UseLightningChatAutoFollowOptions {
  scrollRoot: HTMLDivElement | null;
  bottomInView: boolean;
  lastChatMessageId: string | null;
  lastMessageElement: HTMLDivElement | null;
  initialScrollMode: ChatInitialScrollMode;
  onUserScroll: () => void;
}

export function useLightningChatAutoFollow({
  scrollRoot,
  bottomInView,
  lastChatMessageId,
  lastMessageElement,
  initialScrollMode,
  onUserScroll,
}: UseLightningChatAutoFollowOptions) {
  const shouldAutoFollowRef = useRef(initialScrollMode === "BOTTOM");
  const observedChatMessageIdRef = useRef<string | null>(null);
  const handledChatMessageIdRef = useRef<string | null>(null);

  const [hasPendingIncomingMessage, setHasPendingIncomingMessage] = useState(false);
  const [isBottomOutOfView, setIsBottomOutOfView] = useState(false);

  const syncAutoFollowState = useCallback(() => {
    if (!scrollRoot) return;

    const distanceFromBottom =
      scrollRoot.scrollHeight - scrollRoot.clientHeight - scrollRoot.scrollTop;
    const isNearBottom = distanceFromBottom <= BOTTOM_FOLLOW_THRESHOLD_PX;

    shouldAutoFollowRef.current = isNearBottom;
    setIsBottomOutOfView(!isNearBottom);

    if (isNearBottom) {
      setHasPendingIncomingMessage(false);
    }
  }, [scrollRoot]);

  const setAutoFollowEnabled = useCallback((enabled: boolean) => {
    shouldAutoFollowRef.current = enabled;
    setIsBottomOutOfView(!enabled);

    if (enabled) {
      setHasPendingIncomingMessage(false);
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    if (!scrollRoot) return;

    shouldAutoFollowRef.current = true;
    scrollRoot.scrollTo({ top: scrollRoot.scrollHeight });
    setIsBottomOutOfView(false);
    setHasPendingIncomingMessage(false);
  }, [scrollRoot]);

  useEffect(() => {
    if (!scrollRoot) return;

    const handleScroll = () => {
      onUserScroll();
      syncAutoFollowState();
    };

    scrollRoot.addEventListener("scroll", handleScroll, { passive: true });
    const frame = requestAnimationFrame(() => {
      syncAutoFollowState();
    });

    return () => {
      cancelAnimationFrame(frame);
      scrollRoot.removeEventListener("scroll", handleScroll);
    };
  }, [onUserScroll, scrollRoot, syncAutoFollowState]);

  useEffect(() => {
    if (!bottomInView) return;

    const frame = requestAnimationFrame(() => {
      setAutoFollowEnabled(true);
    });

    return () => cancelAnimationFrame(frame);
  }, [bottomInView, setAutoFollowEnabled]);

  useEffect(() => {
    if (bottomInView) return;

    const frame = requestAnimationFrame(() => {
      setIsBottomOutOfView(!shouldAutoFollowRef.current);
    });

    return () => cancelAnimationFrame(frame);
  }, [bottomInView]);

  useEffect(() => {
    if (!lastChatMessageId) return;

    if (observedChatMessageIdRef.current === null) {
      observedChatMessageIdRef.current = lastChatMessageId;
      return;
    }

    if (observedChatMessageIdRef.current === lastChatMessageId) return;
    observedChatMessageIdRef.current = lastChatMessageId;

    if (shouldAutoFollowRef.current) return;

    const frame = requestAnimationFrame(() => {
      setHasPendingIncomingMessage(true);
    });

    return () => cancelAnimationFrame(frame);
  }, [lastChatMessageId]);

  useEffect(() => {
    if (!scrollRoot) return;
    if (!lastChatMessageId) return;

    if (handledChatMessageIdRef.current === lastChatMessageId) return;
    handledChatMessageIdRef.current = lastChatMessageId;

    if (!shouldAutoFollowRef.current) return;

    requestAnimationFrame(() => {
      scrollRoot.scrollTo({ top: scrollRoot.scrollHeight });
      requestAnimationFrame(() => {
        scrollRoot.scrollTo({ top: scrollRoot.scrollHeight });
      });
    });
  }, [lastChatMessageId, scrollRoot]);

  useEffect(() => {
    if (!scrollRoot || !lastMessageElement) return;

    const resizeObserver = new ResizeObserver(() => {
      if (!shouldAutoFollowRef.current) return;

      requestAnimationFrame(() => {
        scrollToBottom();
      });
    });

    resizeObserver.observe(lastMessageElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, [lastMessageElement, scrollRoot, scrollToBottom]);

  return {
    hasPendingIncomingMessage,
    isBottomOutOfView,
    scrollToBottom,
    setAutoFollowEnabled,
    shouldAutoFollowRef,
  };
}
