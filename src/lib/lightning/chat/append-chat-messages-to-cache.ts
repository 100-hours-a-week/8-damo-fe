import type { QueryClient } from "@tanstack/react-query";
import { getLightningChatMessagesQueryKey } from "@/src/hooks/lightning/chat/use-lightning-chat-infinite";
import { dedupeChatMessages } from "@/src/lib/lightning/chat/merge-chat-messages";
import type { ChatBroadcastMessage } from "@/src/types/chat";
import type { ChatInfiniteData } from "@/src/types/lightning-chat";

export function appendChatMessagesToCache(
  queryClient: QueryClient,
  lightningId: string,
  incomingMessages: ChatBroadcastMessage[]
) {
  if (incomingMessages.length === 0) return;

  queryClient.setQueryData<ChatInfiniteData>(
    getLightningChatMessagesQueryKey(lightningId),
    (old) => {
      if (!old || old.pages.length === 0) {
        const messages = dedupeChatMessages(incomingMessages);
        const lastMessage = messages[messages.length - 1];
        if (!lastMessage) return old;

        return {
          pages: [
            {
              messages,
              pageInfo: {
                previousPageParam: null,
                nextPageParam: null,
              },
              anchorCursor: lastMessage.messageId,
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

      pagesCopy[lastIndex] = {
        ...lastPage,
        messages: dedupeChatMessages([
          ...lastPage.messages,
          ...incomingMessages,
        ]),
      };

      return {
        ...old,
        pages: pagesCopy,
      };
    }
  );
}
