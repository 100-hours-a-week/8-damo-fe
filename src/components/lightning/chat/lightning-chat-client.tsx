"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical } from "lucide-react";
import { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useLightningChatSocket } from "@/src/hooks/lightning/chat/use-lightning-chat-socket";
import { useLightningChatInfinite } from "@/src/hooks/lightning/chat/use-lightning-chat-infinite";
import { useInvalidateLightning } from "@/src/hooks/lightning/use-invalidate-lightning";
import { useUserStore } from "@/src/stores/user-store";
import { leaveLightning } from "@/src/lib/api/client/lightning";
import { appendChatMessageToCache } from "@/src/lib/lightning/chat/append-chat-message-to-cache";
import { ChatMessageList } from "./chat-message-list";
import { ChatInput } from "./chat-input";
import { Header } from "../../layout";
import { Button } from "../../ui/button";
import { toast } from "@/src/components/ui/sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

interface Props {
  lightningId: string;
}

export function LightningChatClient({
  lightningId,
}: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [realtimeChatMessageId, setRealtimeChatMessageId] =
    useState<string | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);
  const currentUserId = useUserStore((state) => state.user?.userId ?? null);
  const { invalidateLightningList } = useInvalidateLightning();

  const handleBack = () => {
    router.push("/lightning?tab=joined");
  };

  const handleLeaveLightning = async () => {
    if (isLeaving) return;
    setIsLeaving(true);
    try {
      const res = await leaveLightning(lightningId);
      if (res.errorMessage) {
        toast.error(res.errorMessage);
        return;
      }
      await invalidateLightningList();
      router.push("/lightning?tab=joined");
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? (error.response?.data?.errorMessage ?? "번개 모임을 나가는 중 오류가 발생했습니다.")
          : "번개 모임을 나가는 중 오류가 발생했습니다.";
      toast.error(message);
    } finally {
      setIsLeaving(false);
    }
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
    markInitialized,
    recoverMissedMessages,
    error: queryError,
  } = useLightningChatInfinite({ lightningId });
  const isWaitingInitialResponse = isPending && !data;
  const hasInitialPage = Boolean(data?.pages?.[0]);
  const initialLastReadMessageId =
    readBoundary?.lastReadMessageId != null
      ? String(readBoundary.lastReadMessageId)
      : null;
  const lastChatMessageId =
    realtimeChatMessageId ?? initialLastReadMessageId;
  console.log(process.env.NEXT_PUBLIC_APP_ENV);
  // Scenario 2: 버스트 메시지 (10개 / 1초) 시뮬레이션
  const simulateBurst = useCallback((count = 10) => {
    Array.from({ length: count }).forEach((_, i) => {
      setTimeout(() => {
        const fakeId = `burst-${Date.now()}-${i}`;
        if (process.env.NEXT_PUBLIC_APP_ENV !== "dev") {
          performance.mark(`chat:ws-received:${fakeId}`);
        }
        appendChatMessageToCache(queryClient, lightningId, {
          messageId: fakeId,
          senderId: "9999",
          lightningId,
          chatType: "TEXT",
          content: `[버스트 ${i + 1}/${count}] 성능 테스트 메시지`,
          createdAt: new Date().toISOString(),
          senderNickname: "테스터",
          senderImagePath: null,
          unreadCount: 0,
        });
      }, i * 100);
    });
  }, [queryClient, lightningId]); // perf

  const handleChatMessage = useCallback((messageId: string) => {
    setRealtimeChatMessageId(messageId);
  }, []);

  const {
    error: socketError,
    sendMessage,
  } = useLightningChatSocket({
    lightningId,
    enabled: hasInitialPage,
    onChatMessage: handleChatMessage,
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

  const moreMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="sm:size-10">
          <MoreVertical className="size-5 sm:size-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className=""
          disabled={isLeaving}
          onClick={handleLeaveLightning}
        >
          번개에서 나가기
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (isWaitingInitialResponse) {
    return (
      <div className="mx-auto flex h-full w-full min-w-[320px] max-w-[430px] flex-col bg-background">
        <Header
          title="번개 채팅"
          onBack={handleBack}
          rightElement={moreMenu}
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
        rightElement={moreMenu}
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
        markInitialized={markInitialized}
        lastChatMessageId={lastChatMessageId}
      />

      {errorMessage && (
        <p className="px-4 pt-2 text-xs text-destructive">
          {errorMessage}
        </p>
      )}

      <button
        onClick={() => simulateBurst(10)}
        className="mx-4 mb-1 rounded bg-yellow-200 px-3 py-1 text-xs text-yellow-900"
      >
        [DEV - perf] 시나리오 2: 버스트 10개 전송
      </button>

      <ChatInput onSend={sendMessage}/>
    </div>
  );
}
