"use client";

import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLightningChatSocket } from "@/src/hooks/lightning/chat/use-lightning-chat-socket";
import { useLightningChatInfinite } from "@/src/hooks/lightning/chat/use-lightning-chat-infinite";
import { useUserStore } from "@/src/stores/user-store";
import { IconButton } from "@/src/components/ui/icon-button";
import { ChatMessageList } from "./chat-message-list";
import { ChatInput } from "./chat-input";

interface Props {
  lightningId: string;
}

export function LightningChatClient({
  lightningId,
}: Props) {
  const router = useRouter();
  const currentUserId = useUserStore((state) => state.user?.userId ?? null);

  const {
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

  const { error: socketError, sendMessage } = useLightningChatSocket({
    lightningId,
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

  return (
    <div className="mx-auto flex h-full w-full min-w-[320px] max-w-[430px] flex-col bg-background">
      <header className="flex h-14 items-center border-b border-border bg-background px-2 sm:h-16 sm:px-3">
        <IconButton
          icon={ArrowLeft}
          aria-label="뒤로 가기"
          onClick={() => router.back()}
          className="text-foreground"
        />
        <h1 className="ml-1 flex-1 text-lg font-semibold leading-7 text-foreground">
          번개 채팅
        </h1>
      </header>

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
