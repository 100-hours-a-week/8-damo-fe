"use client";

import { Fragment, memo, useLayoutEffect } from "react";
import { Avatar } from "@/src/components/ui/avatar";
import { PROFILE_FALLBACK_IMAGE } from "@/src/constants/image";
import { getProfileImageUrl } from "@/src/lib/profile-image";
import type { ChatBroadcastMessage } from "@/src/types/chat";
import { ChatUnreadDivider } from "./chat-unread-divider";

function formatChatTime(createdAt: string): string {
  const parsed = new Date(createdAt);
  if (Number.isNaN(parsed.getTime())) return "";

  return new Intl.DateTimeFormat("ko-KR", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(parsed);
}

interface Props {
  message: ChatBroadcastMessage;
  currentUserId: string | null;
  showDividerBefore: boolean;
  showDividerAfter: boolean;
}

export const ChatMessageItem = memo(function ChatMessageItem({
  message,
  currentUserId,
  showDividerBefore,
  showDividerAfter,
}: Props) {
  useLayoutEffect(() => {
    performance.mark(`chat:rendered:${message.messageId}`);
    try {
      performance.measure(
        `chat:render-latency:${message.messageId}`,
        `chat:ws-received:${message.messageId}`,
        `chat:rendered:${message.messageId}`,
      );
    } catch {
      // ws-received mark가 없는 기존 메시지는 조용히 무시
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // perf

  const isMine = message.senderId === currentUserId;
  const timeText = formatChatTime(message.createdAt);
  const senderLabel = isMine ? "나" : message.senderNickname;
  const senderImageUrl = isMine
    ? null
    : getProfileImageUrl(message.senderId, message.senderImagePath ?? null);
  const unreadCount = message.unreadCount ?? 0;
  const shouldShowUnreadCount =
    Number.isFinite(unreadCount) && unreadCount > 0;

  return (
    <Fragment>
      {showDividerBefore && <ChatUnreadDivider />}

      <li
        data-message-id={String(message.messageId)}
        className={isMine ? "flex justify-end" : "flex items-start gap-2"}
      >
        {!isMine && (
          <Avatar
            src={senderImageUrl}
            alt={senderLabel ?? "사용자"}
            fallbackText={senderLabel ?? "사용자"}
            fallbackUrl={PROFILE_FALLBACK_IMAGE}
            size="sm"
            showBorder={false}
            className="mt-0.5"
          />
        )}

        <div className="max-w-[78%] min-w-0 space-y-1">
          {!isMine && (
            <p className="px-1 text-xs text-muted-foreground">
              {senderLabel}
            </p>
          )}

          <div
            className={
              isMine
                ? "flex items-end justify-end gap-1.5"
                : "flex items-end gap-1.5"
            }
          >
            {isMine && shouldShowUnreadCount && (
              <span className="mb-1 text-xs font-semibold leading-none text-primary">
                {unreadCount}
              </span>
            )}

            <p
              className={
                isMine
                  ? "max-w-full break-all rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-base leading-6 text-primary-foreground"
                  : "max-w-full break-all break-words rounded-2xl rounded-bl-md bg-background px-4 py-2.5 text-base leading-6 text-foreground shadow-xs"
              }
            >
              {message.content}
            </p>

            {!isMine && shouldShowUnreadCount && (
              <span className="mb-1 text-xs font-semibold leading-none text-primary">
                {unreadCount}
              </span>
            )}
          </div>

          {timeText && (
            <p
              className={
                isMine
                  ? "px-1 text-right text-xs text-muted-foreground"
                  : "px-1 text-xs text-muted-foreground"
              }
            >
              {timeText}
            </p>
          )}
        </div>
      </li>

      {showDividerAfter && <ChatUnreadDivider />}
    </Fragment>
  );
});
