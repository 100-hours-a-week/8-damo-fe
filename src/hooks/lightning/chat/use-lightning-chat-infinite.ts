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
import { recoverMissedMessagesFromServer } from "@/src/lib/lightning/chat/recover-missed-messages";

const CHAT_PAGE_SIZE = 30;

interface UseLightningChatInfiniteOptions {
  lightningId: string;
  size?: number;
}

function toValidPageParam(
  param: ChatPageParam | null | undefined,
  fallbackDirection: "PREV" | "NEXT",
  fallbackSize: number
): ChatPageParam | undefined {
  if (!param) return undefined;

  const cursorId = param.cursorId;

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
    initialPageParam: {
      direction: null,
      size: 20,
    } as ChatPageParam | undefined,
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

  const pages = useMemo(() => query.data?.pages ?? [], [query.data?.pages]);
  const messages = useMemo(
    () => dedupeAndSortById(pages.flatMap((page) => page.messages)),
    [pages]
  );

  const initialPage = pages[0];
  const initialScrollMode = initialPage?.initialScrollMode ?? "NONE";
  const anchorCursor = initialPage?.anchorCursor ?? 0;
  const readBoundary = initialPage?.readBoundary ?? null;

  const maxMessageId = useMemo(() => {
    if (messages.length === 0) return "0";
    return messages.reduce((max, message) => {
      const current = message.messageId;
      return Number(current) > Number(max) ? current : max;
    }, "0");
  }, [messages]);
  const recoverMissedMessages = useCallback(async () => {
    await recoverMissedMessagesFromServer(
      queryClient,
      queryKey,
      lightningId,
      maxMessageId,
      size
    );
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
