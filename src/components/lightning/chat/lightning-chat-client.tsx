"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical } from "lucide-react";
import { AxiosError } from "axios";
import { useInvalidateLightning } from "@/src/hooks/lightning/use-invalidate-lightning";
import { leaveLightning } from "@/src/lib/api/client/lightning";
import { ChatBody } from "./chat-body";
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

export function LightningChatClient({ lightningId }: Props) {
  const router = useRouter();
  const [isLeaving, setIsLeaving] = useState(false);
  const hasHandledChatNotFoundRef = useRef(false);
  const { invalidateLightningList } = useInvalidateLightning();

  const handleBack = useCallback(() => {
    router.push("/lightning?tab=joined");
  }, [router]);

  const handleLeaveLightning = useCallback(async () => {
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
  }, [isLeaving, lightningId, invalidateLightningList, router]);

  const handleChatNotFound = useCallback(() => {
    if (hasHandledChatNotFoundRef.current) return;

    hasHandledChatNotFoundRef.current = true;
    toast.error("참여하지 않은 번개 모임입니다.");
    router.replace("/lightning?tab=joined");
  }, [router]);

  const moreMenu = useMemo(() => (
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
  ), [isLeaving, handleLeaveLightning]);

  return (
    <div className="font-system-ui mx-auto flex h-full w-full min-w-[320px] max-w-[430px] flex-col bg-background">
      <Header title="번개 채팅" onBack={handleBack} rightElement={moreMenu} />
      <ChatBody lightningId={lightningId} onNotFound={handleChatNotFound} />
    </div>
  );
}
