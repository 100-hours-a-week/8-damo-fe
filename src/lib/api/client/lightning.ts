import { formatLightningDateLabel } from "@/src/lib/utils";
import type { ChatBroadcastMessage } from "@/src/types/chat";
import type { LightningDetail } from "@/src/types/lightning";
import type {
  ChatMessagePageRaw,
  ChatMessagePageResponse,
  ChatPageParam,
  ChatPageParamRaw,
  GetLightningChatMessagesParams,
} from "@/src/types/api/lightning/chat";
import type {
  CreateLightningRequest,
  LightningDetailResponse,
} from "@/src/types/api/lightning/lightning";
import { bffGet, bffPost, type ApiResponse } from "./index";

function mapLightningDetail(raw: LightningDetailResponse): LightningDetail {
  return {
    id: raw.lightningId,
    title: raw.restaurantName,
    meetingDate: formatLightningDateLabel(raw.lightningDate),
    restaurantName: raw.restaurantName,
    currentParticipants: raw.participantsCount,
    maxParticipants: raw.maxParticipants,
    description: raw.description,
    lightningStatus: raw.lightningStatus,
    location: {
      lat: Number(raw.latitude),
      lng: Number(raw.longitude),
    },
    participants: raw.participants.map((participant) => ({
      id: String(participant.userId),
      nickname: participant.nickname,
      role: participant.role,
      avatarUrl: null,
    })),
  };
}

function mapChatPageParam(
  param: ChatPageParamRaw | null | undefined
): ChatPageParam | null {
  if (!param) return null;

  if (!param.cursorId) return null;

  return {
    direction: param.direction,
    cursorId: Number(param.cursorId),
    size: Number(param.size),
  };
}

function mapChatMessage(dto: ChatMessagePageRaw["messages"][number]): ChatBroadcastMessage {
  return {
    messageId: String(dto.messageId),
    senderId: String(dto.senderId),
    lightningId: String(dto.lightningId),
    chatType: dto.chatType,
    content: dto.content,
    createdAt: dto.createdAt,
  };
}

function mapChatPage(dto: ChatMessagePageRaw): ChatMessagePageResponse {
  return {
    messages: dto.messages.map(mapChatMessage),
    pageInfo: {
      previousPageParam: mapChatPageParam(dto.pageInfo?.previousPageParam),
      nextPageParam: mapChatPageParam(dto.pageInfo?.nextPageParam),
    },
    anchorCursor: Number(dto.anchorCursor),
    initialScrollMode: dto.initialScrollMode ?? "NONE",
    readBoundary: dto.readBoundary
      ? {
          showDivider: dto.readBoundary.showDivider,
          lastReadMessageId: dto.readBoundary.lastReadMessageId
            ? Number(dto.readBoundary.lastReadMessageId)
            : null,
          firstUnreadMessageId: dto.readBoundary.firstUnreadMessageId
            ? Number(dto.readBoundary.firstUnreadMessageId)
            : null,
        }
      : null,
  };
}


export async function getLightningDetail(
  lightningId: string
): Promise<ApiResponse<LightningDetail>> {
  const response = await bffGet<LightningDetailResponse>(`/lightning/${lightningId}`);

  return {
    ...response,
    data: mapLightningDetail(response.data),
  };
}

export async function createLightning(
  data: CreateLightningRequest
): Promise<ApiResponse<number>> {
  return bffPost<number>("/lightning", data);
}

export async function getLightningChatMessages(
  params: GetLightningChatMessagesParams
): Promise<ApiResponse<ChatMessagePageResponse>> {
  const { lightningId, direction, cursorId, size = 30 } = params;

  const query: Record<string, string | number> = { size };
  if (direction) query.direction = direction;
  if (cursorId) query.cursorId = cursorId;

  const response = await bffGet<ChatMessagePageRaw>(
    `/lightning/${lightningId}/chat-messages`,
    { params: query }
  );

  return {
    ...response,
    data: mapChatPage(response.data),
  };
}
