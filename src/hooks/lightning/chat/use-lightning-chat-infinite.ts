"use client";

import { useCallback, useMemo } from "react";
import {
  useInfiniteQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { getLightningChatMessages } from "@/src/lib/api/client/lightning";
import type {
  ChatMessagePageResponse,
  ChatPageParam,
  GetLightningChatMessagesParams
} from "@/src/types/api/lightning/chat";
import type { ChatBroadcastMessage } from "@/src/types/chat";

const CHAT_PAGE_SIZE = 30;

interface UseLightningChatInfiniteOptions {
  lightningId: string;
  size?: number;
}

type ChatInfiniteData = InfiniteData<
  ChatMessagePageResponse,
  ChatPageParam | undefined
>;

function toValidPageParam(
  param: ChatPageParam | null | undefined,
  fallbackDirection: "PREV" | "NEXT",
  fallbackSize: number
): ChatPageParam | undefined {
  if (!param) return undefined;

  const cursorId = Number(param.cursorId);
  if (!Number.isFinite(cursorId) || cursorId <= 0) return undefined;

  const direction =
    param.direction === "PREV" || param.direction === "NEXT"
      ? param.direction
      : fallbackDirection;

  const size = Number(param.size);
  return {
    direction,
    cursorId,
    size: Number.isFinite(size) && size > 0 ? size : fallbackSize,
  };
}

export function getLightningChatMessagesQueryKey(lightningId: string) {
  return ["lightning", "chat", "messages", lightningId] as const;
}

export function dedupeAndSortById(
  messages: ChatBroadcastMessage[]
): ChatBroadcastMessage[] {
  const unique = new Map<string, ChatBroadcastMessage>();

  for (const message of messages) {
    unique.set(String(message.messageId), message);
  }

  return Array.from(unique.values()).sort(
    (a, b) => Number(a.messageId) - Number(b.messageId)
  );
}

export function useLightningChatInfinite({
  lightningId,
  size = CHAT_PAGE_SIZE,
}: UseLightningChatInfiniteOptions) {
  const queryClient = useQueryClient();
  const queryKey = getLightningChatMessagesQueryKey(lightningId);

  const query = useInfiniteQuery({
    queryKey,
    initialPageParam: undefined as ChatPageParam | undefined,
    queryFn: async ({ pageParam }) => {
      const params: GetLightningChatMessagesParams = {
        lightningId,
        size,
        ...(pageParam && {
          direction: pageParam.direction,
          cursorId: pageParam.cursorId,
          size: pageParam.size,
        }),
      };
      const response = await getLightningChatMessages(params);
      return response.data;
    },
    getPreviousPageParam: (firstPage) =>
      toValidPageParam(firstPage.pageInfo.previousPageParam, "PREV", size),
    getNextPageParam: (lastPage) =>
      toValidPageParam(lastPage.pageInfo.nextPageParam, "NEXT", size),
    staleTime: 10_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const pages = query.data?.pages ?? [];
  const messages = useMemo(
    () => dedupeAndSortById(pages.flatMap((page) => page.messages)),
    [pages]
  );

  const initialPage = pages[0];
  const initialScrollMode = initialPage?.initialScrollMode ?? "NONE";
  const anchorCursor = initialPage?.anchorCursor ?? 0;
  const readBoundary = initialPage?.readBoundary ?? null;

  const maxMessageId = useMemo(() => {
    if (messages.length === 0) return 0;
    return messages.reduce((max, message) => {
      const current = Number(message.messageId);
      return current > max ? current : max;
    }, 0);
  }, [messages]);

  const recoverMissedMessages = useCallback(async () => {
    if (maxMessageId <= 0) return;

    const recoveredResponse = await getLightningChatMessages({
      lightningId,
      direction: "NEXT",
      cursorId: maxMessageId,
      size,
    });

    const recoveredPage = recoveredResponse.data;
    if (recoveredPage.messages.length === 0) return;

    queryClient.setQueryData<ChatInfiniteData>(queryKey, (old) => {
      if (!old || old.pages.length === 0) return old;

      const pagesCopy = [...old.pages];
      const lastIndex = pagesCopy.length - 1;
      const lastPage = pagesCopy[lastIndex];

      pagesCopy[lastIndex] = {
        ...lastPage,
        messages: dedupeAndSortById([
          ...lastPage.messages,
          ...recoveredPage.messages,
        ]),
        pageInfo: {
          ...lastPage.pageInfo,
          nextPageParam: recoveredPage.pageInfo.nextPageParam,
        },
      };

      return {
        ...old,
        pages: pagesCopy,
      };
    });
  }, [lightningId, maxMessageId, queryClient, queryKey, size]);

  return {
    ...query,
    queryKey,
    messages,
    initialScrollMode,
    anchorCursor,
    readBoundary,
    maxMessageId,
    recoverMissedMessages,
  };
}
