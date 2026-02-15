import type { InfiniteData } from "@tanstack/react-query";
import type {
  ChatMessagePageResponse,
  ChatPageParam,
} from "@/src/types/api/lightning/chat";

export type ChatInfiniteData = InfiniteData<
  ChatMessagePageResponse,
  ChatPageParam | undefined
>;