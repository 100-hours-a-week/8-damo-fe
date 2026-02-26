import type { QueryClient } from "@tanstack/react-query";
import type { ChatInfiniteData} from "@/src/types/lightning-chat";
import { getLightningChatMessages } from "@/src/lib/api/client/lightning";
import { dedupeAndSortById } from "@/src/hooks/lightning/chat/use-lightning-chat-infinite";

export async function recoverMissedMessagesFromServer(
  queryClient: QueryClient,
  queryKey: readonly unknown[],
  lightningId: string,
  maxMessageId: string,
  size: number
) {
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
}
