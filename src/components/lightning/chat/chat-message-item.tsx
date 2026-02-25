"use client";

import { Fragment } from "react";
import type { ChatBroadcastMessage } from "@/src/types/chat";
import { ChatUnreadDivider } from "./chat-unread-divider";

const avatarDemo = "🤍";

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

export function ChatMessageItem({
  message,
  currentUserId,
  showDividerBefore,
  showDividerAfter,
}: Props) {
  const isMine = message.senderId === currentUserId;
  const timeText = formatChatTime(message.createdAt);
  const senderLabel = isMine ? "나" : `사용자 ${message.senderId}`;
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
          <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-primary to-[#ff6b28] text-sm text-primary-foreground">
            {avatarDemo}
          </div>
        )}

        <div className="max-w-[78%] space-y-1">
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
                  ? "break-words rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-base leading-6 text-primary-foreground"
                  : "break-words rounded-2xl rounded-bl-md bg-background px-4 py-2.5 text-base leading-6 text-foreground shadow-xs"
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
}
