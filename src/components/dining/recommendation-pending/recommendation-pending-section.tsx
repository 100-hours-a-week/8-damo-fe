"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useDiningRecommendationStream } from "@/src/hooks/dining/use-dining-recommendation-stream";
import { useTypewriter } from "@/src/hooks/use-typewriter";
import { RecommendationPendingMessage } from "./recommendation-pending-message";

interface RecommendationPendingSectionProps {
  groupId: string;
  diningId: string;
}

const NICKNAME_COLORS = [
  "#ff8d28",
  "#007aff",
  "#34c759",
  "#ff375f",
  "#af52de",
  "#ff9500",
];

interface RecommendationPendingTypingContentProps {
  content: string;
}

function RecommendationPendingTypingContent({
  content,
}: RecommendationPendingTypingContentProps) {
  const typedContent = useTypewriter(content, { intervalMs: 18 });

  return (
    <p className="mt-1 text-[13px] leading-5 text-[#3a3a3c]">
      {typedContent}
    </p>
  );
}

export function RecommendationPendingSection({
  groupId,
  diningId,
}: RecommendationPendingSectionProps) {
  const {
    streamStatus,
    messages,
    errorMessage,
    retryCount,
    isExpired,
    reconnect,
  } = useDiningRecommendationStream({
    groupId,
    diningId,
    enabled: Boolean(groupId && diningId),
  });

  const showSpinner = streamStatus === "connecting";

  const description = isExpired
    ? "추천이 예상보다 오래 걸리고 있습니다. 잠시 후 다시 시도해주세요."
    : errorMessage
      ? errorMessage
      : "조금만 기다려주세요! 금방 추천드릴게요 ✨";

  const isRetryAvailable = streamStatus === "error" && retryCount >= 3;

  const getNicknameColor = (nickname: string): string => {
    const hashValue = nickname
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return NICKNAME_COLORS[hashValue % NICKNAME_COLORS.length];
  };

  return (
    <section className="w-full min-h-[112px] rounded-[20px] bg-white p-4 sm:min-h-[120px] sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <RecommendationPendingMessage description={description} />
        {showSpinner ? (
          <div className="flex items-center gap-2">
            <Loader2 className="size-5 animate-spin text-[#ff8d28]" />
          </div>
        ) : null}
      </div>

      {messages.length > 0 ? (
        <ul className="mt-3 flex flex-col gap-2">
          {messages.map((message) => (
            <li
              key={message.eventId}
              className="rounded-xl bg-[#f8f8fb] px-3 py-2"
            >
              <p
                className="text-[12px] font-semibold leading-4"
                style={{ color: getNicknameColor(message.nickname) }}
              >
                {message.nickname}
              </p>
              <RecommendationPendingTypingContent
                content={message.content}
              />
            </li>
          ))}
        </ul>
      ) : null}

      {isRetryAvailable ? (
        <div className="mt-3">
          <Button
            type="button"
            variant="outline"
            className="h-9 w-full rounded-xl text-[13px] font-medium"
            onClick={reconnect}
          >
            연결 다시 시도
          </Button>
        </div>
      ) : null}
    </section>
  );
}
