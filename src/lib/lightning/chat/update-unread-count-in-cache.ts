import type { QueryClient } from "@tanstack/react-query";
import { getLightningChatMessagesQueryKey } from "@/src/hooks/lightning/chat/use-lightning-chat-infinite";
import type { UpdateUnreadCountEventPayload } from "@/src/types/chat";
import type { ChatInfiniteData } from "@/src/types/lightning-chat";

export function updateUnreadCountInCache(
  queryClient: QueryClient,
  lightningId: string,
  payload: UpdateUnreadCountEventPayload,
  currentUserId: number | null
) {
  const actorUserId = Number(payload.userId);

  if (
    currentUserId !== null &&
    Number.isFinite(actorUserId) &&
    actorUserId === Number(currentUserId)
  ) {
    return;
  }

  const startRaw = payload.startChatMessageId;
  const endRaw = payload.endChatMessageId;

  const startId = Number(startRaw);
  const endId = Number(endRaw);

  if (
    !Number.isFinite(startId) ||
    !Number.isFinite(endId)
  ) {
    return;
  }

  const rangeStart = Math.min(startId, endId);
  const rangeEnd = Math.max(startId, endId);

  if (rangeEnd <= rangeStart) {
    return;
  }

  queryClient.setQueryData<ChatInfiniteData>(
    getLightningChatMessagesQueryKey(lightningId),
    (old) => {
      if (!old || old.pages.length === 0) return old;

      let hasChanged = false;

      const pages = old.pages.map((page) => {
        let pageChanged = false;

        const messages = page.messages.map((message) => {
          const messageId = Number(message.messageId);

          if (!Number.isFinite(messageId)) {
            return message;
          }

          if (
            messageId <= rangeStart ||
            messageId > rangeEnd
          ) {
            return message;
          }

          const currentUnreadCount =
            typeof message.unreadCount === "number" &&
            Number.isFinite(message.unreadCount)
              ? message.unreadCount
              : null;

          if (currentUnreadCount === null) {
            return message;
          }

          const nextUnreadCount = Math.max(
            currentUnreadCount - 1,
            0
          );

          if (nextUnreadCount === currentUnreadCount) {
            return message;
          }

          hasChanged = true;
          pageChanged = true;

          return {
            ...message,
            unreadCount: nextUnreadCount,
          };
        });

        if (!pageChanged) return page;

        return {
          ...page,
          messages,
        };
      });

      if (!hasChanged) return old;

      return {
        ...old,
        pages,
      };
    }
  );
}