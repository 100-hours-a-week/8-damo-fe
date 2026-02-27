"use client";

import { useTypewriter } from "@/src/hooks/use-typewriter";
import type { RecommendationStreamMessage } from "@/src/types/api/dining";

const NICKNAME_COLORS = [
  "#ff8d28",
  "#007aff",
  "#34c759",
  "#ff375f",
  "#af52de",
  "#ff9500",
];

interface RecommendationPendingStreamingPanelProps {
  messages: RecommendationStreamMessage[];
}

interface RecommendationPendingTypingContentProps {
  content: string;
}

function formatMessageTime(createdAt: string): string {
  const parsedDate = new Date(createdAt);
  if (Number.isNaN(parsedDate.getTime())) return "";

  return parsedDate.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function getNicknameColor(nickname: string): string {
  const hashValue = nickname
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return NICKNAME_COLORS[hashValue % NICKNAME_COLORS.length];
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

export function RecommendationPendingStreamingPanel({
  messages,
}: RecommendationPendingStreamingPanelProps) {
  return (
    <ul
      aria-live="polite"
      className="relative mt-3 flex max-h-[300px] flex-col gap-2 overflow-y-auto pr-1"
    >
      {messages.map((message, index) => (
        <li
          key={message.eventId}
          className="rounded-2xl border border-primary bg-white/85 px-3 py-2.5 backdrop-blur-sm animate-in fade-in-0 slide-in-from-bottom-1 duration-300"
          style={{
            animationDelay: `${Math.min(index * 55, 240)}ms`,
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <p
              className="text-[12px] font-semibold leading-4"
              style={{ color: getNicknameColor(message.nickname) }}
            >
              {message.nickname}
            </p>
            <span className="text-[11px] leading-4 text-[#a1a1aa]">
              {formatMessageTime(message.createdAt)}
            </span>
          </div>
          <RecommendationPendingTypingContent content={message.content} />
        </li>
      ))}
    </ul>
  );
}
