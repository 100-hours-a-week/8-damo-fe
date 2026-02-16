import { socketManager } from "@/src/lib/websocket/socket-manager";
import type { ChatMessageRequest } from "@/src/types/chat";

export function publishChatMessage(
  lightningId: string,
  body: ChatMessageRequest
) {
  socketManager.publish(
    `/pub/message/${lightningId}`,
    JSON.stringify(body)
  );
}
