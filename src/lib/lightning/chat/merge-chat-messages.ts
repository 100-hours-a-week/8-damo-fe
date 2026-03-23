import type { ChatBroadcastMessage } from "@/src/types/chat";

function toSortableMessageId(messageId: string) {
  const parsed = Number(messageId);
  return Number.isFinite(parsed) ? parsed : null;
}

function compareByCreatedAt(
  a: ChatBroadcastMessage,
  b: ChatBroadcastMessage
) {
  const left = Date.parse(a.createdAt);
  const right = Date.parse(b.createdAt);

  if (Number.isFinite(left) && Number.isFinite(right) && left !== right) {
    return left - right;
  }

  return String(a.messageId).localeCompare(String(b.messageId));
}

export function sortChatMessages(
  messages: ChatBroadcastMessage[]
): ChatBroadcastMessage[] {
  return [...messages].sort((a, b) => {
    const leftId = toSortableMessageId(String(a.messageId));
    const rightId = toSortableMessageId(String(b.messageId));

    if (leftId !== null && rightId !== null && leftId !== rightId) {
      return leftId - rightId;
    }

    if (leftId !== null && rightId === null) return -1;
    if (leftId === null && rightId !== null) return 1;

    return compareByCreatedAt(a, b);
  });
}

export function dedupeChatMessages(
  messages: ChatBroadcastMessage[]
): ChatBroadcastMessage[] {
  const unique = new Map<string, ChatBroadcastMessage>();

  for (const message of messages) {
    unique.set(String(message.messageId), message);
  }

  return sortChatMessages(Array.from(unique.values()));
}
