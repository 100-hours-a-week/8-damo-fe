"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLightningChatSocket } from "@/src/hooks/lightning/chat/use-lightning-chat-socket";
import { useLightningChatInfinite } from "@/src/hooks/lightning/chat/use-lightning-chat-infinite";
import { useUserStore } from "@/src/stores/user-store";
import { ChatMessageList } from "./chat-message-list";
import { ChatInput } from "./chat-input";
import { Header } from "../../layout";

interface Props {
  lightningId: string;
}

export function LightningChatClient({
  lightningId,
}: Props) {
  const router = useRouter();
  const currentUserId = useUserStore((state) => state.user?.userId ?? null);

  const handleBack = () => {
    router.push("/lightning?tab=joined");
  };

  const {
    data,
    isPending,
    messages,
    readBoundary,
    initialScrollMode,
    anchorCursor,
    hasPreviousPage,
    hasNextPage,
    isFetchingPreviousPage,
    isFetchingNextPage,
    fetchPreviousPage,
    fetchNextPage,
    recoverMissedMessages,
    error: queryError,
  } = useLightningChatInfinite({ lightningId });
  const isWaitingInitialResponse = isPending && !data;
  const hasInitialPage = Boolean(data?.pages?.[0]);

  const {
    error: socketError,
    sendMessage,
    lastChatMessageId,
  } = useLightningChatSocket({
    lightningId,
    enabled: hasInitialPage,
  });

  useEffect(() => {
    const handleFocus = () => {
      void recoverMissedMessages();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [recoverMissedMessages]);

  const errorMessage =
    socketError ?? (queryError instanceof Error ? queryError.message : null);

  if (isWaitingInitialResponse) {
    return (
      <div className="mx-auto flex h-full w-full min-w-[320px] max-w-[430px] flex-col bg-background">
        <Header
          title="번개 채팅"
          onBack={handleBack}
        />

        <section className="flex-1 bg-card px-4 py-4">
          <div className="space-y-3">
            <div className="h-4 w-24 animate-pulse rounded bg-[#f1e7dc]" />
            <div className="h-10 w-3/4 animate-pulse rounded-2xl bg-[#f1e7dc]" />
            <div className="h-10 w-1/2 animate-pulse rounded-2xl bg-[#f1e7dc]" />
            <div className="h-10 w-4/5 animate-pulse rounded-2xl bg-[#f1e7dc]" />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-full w-full min-w-[320px] max-w-[430px] flex-col bg-background">
      <Header
        title="번개 채팅"
        onBack={handleBack}
      />
      
      <ChatMessageList
        messages={messages}
        currentUserId={currentUserId}
        readBoundary={readBoundary}
        initialScrollMode={initialScrollMode}
        anchorCursor={anchorCursor}
        hasPreviousPage={Boolean(hasPreviousPage)}
        hasNextPage={Boolean(hasNextPage)}
        isFetchingPreviousPage={isFetchingPreviousPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchPreviousPage={fetchPreviousPage}
        fetchNextPage={fetchNextPage}
        lastChatMessageId={lastChatMessageId}
      />

      {errorMessage && (
        <p className="px-4 pt-2 text-xs text-destructive">
          {errorMessage}
        </p>
      )}

      <ChatInput onSend={sendMessage}/>
    </div>
  );
}
