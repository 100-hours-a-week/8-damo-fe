import type { QueryClient } from "@tanstack/react-query";
import type { ChatBroadcastMessage } from "@/src/types/chat";
import { getLightningChatMessagesQueryKey } from "@/src/hooks/lightning/chat/use-lightning-chat-infinite";
import type { ChatInfiniteData } from "@/src/types/lightning-chat";

export function appendChatMessageToCache(
  queryClient: QueryClient,
  lightningId: string,
  incomingMessage: ChatBroadcastMessage
) {
  queryClient.setQueryData<ChatInfiniteData>(
    getLightningChatMessagesQueryKey(lightningId),
    (old) => {
      if (!old || old.pages.length === 0) {
        return {
          pages: [
            {
              messages: [incomingMessage],
              pageInfo: {
                previousPageParam: null,
                nextPageParam: null,
              },
              anchorCursor: incomingMessage.messageId,
              initialScrollMode: "BOTTOM",
              readBoundary: null,
            },
          ],
          pageParams: [undefined],
        };
      }

      const pagesCopy = [...old.pages];
      const lastIndex = pagesCopy.length - 1;
      const lastPage = pagesCopy[lastIndex];
      const msgs = lastPage.messages;
      const existingIds = new Set(msgs.map((m) => String(m.messageId)));
      if (existingIds.has(String(incomingMessage.messageId))) return old;

      pagesCopy[lastIndex] = {
        ...lastPage,
        messages: [...msgs, incomingMessage],
      };

      return {
        ...old,
        pages: pagesCopy,
      };
    }
  );
}