"use client";

import { ChatBroadcastMessage } from "@/src/types/chat";

interface Props {
  messages: ChatBroadcastMessage[];
}

export function ChatMessageList({ messages }: Props) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.map((msg) => (
        <div 
          key={msg.messageId}
          className="rounded bg-gray-100 p-2 text-sm">
          {msg.content}
        </div>
      ))}
    </div>
  );
}
