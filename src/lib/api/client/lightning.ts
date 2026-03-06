import { formatLightningDateLabel } from "@/src/lib/utils";
import type { ChatBroadcastMessage } from "@/src/types/chat";
import type { LightningDetail, LightningListPage, LightningTab } from "@/src/types/lightning";
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
  LightningRecommendationResponse,
} from "@/src/types/api/lightning/lightning";
import type { Restaurant } from "@/src/types/lightning";
import { bffGet, bffPost, bffDelete, type ApiResponse } from "./index";

function mapRecommendation(raw: LightningRecommendationResponse): Restaurant {
  return {
    id: raw.restaurantId,
    name: raw.restaurantName,
    description: "",
    phoneNumber: raw.phoneNumber,
    location: {
      lat: Number(raw.y),
      lng: Number(raw.x),
    },
  };
}

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
    cursorId: param.cursorId,
    size: Number(param.size),
  };
}

function mapChatMessage(dto: ChatMessagePageRaw["messages"][number]): ChatBroadcastMessage {
  const parsedUnreadCount = Number(dto.unreadCount);

  return {
    messageId: String(dto.messageId),
    senderId: String(dto.senderId),
    senderNickname: dto.senderNickname,
    senderImagePath: dto.senderImagePath ?? null,
    lightningId: String(dto.lightningId),
    chatType: dto.chatType,
    content: dto.content,
    createdAt: dto.createdAt,
    unreadCount: Number.isFinite(parsedUnreadCount) ? parsedUnreadCount : 0,
  };
}

function mapChatPage(dto: ChatMessagePageRaw): ChatMessagePageResponse {
  return {
    messages: dto.messages.map(mapChatMessage),
    pageInfo: {
      previousPageParam: mapChatPageParam(dto.pageInfo?.previousPageParam),
      nextPageParam: mapChatPageParam(dto.pageInfo?.nextPageParam),
    },
    anchorCursor: dto.anchorCursor,
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


interface MyLightningRaw {
  lightningId: string;
  restaurantName: string;
  description: string;
  maxParticipants: number;
  participantsCount: number;
  lightningStatus?: string;
  lightningDate?: string;
  lightningData?: string;
  unreadCount?: number;
}

interface LightningListDto {
  data: MyLightningRaw[];
  nextCursor: string | null;
  hasNext: boolean;
}

export async function getLightningList(
  tab: LightningTab,
  lastLightningId?: string,
  size = 10
): Promise<ApiResponse<LightningListPage>> {
  const endpoint =
    tab === "joined" ? "/lightning/me/joined" : "/lightning/me/available";
  const params: Record<string, string | number> = { size };
  if (lastLightningId) params.lastLightningId = lastLightningId;

  const response = await bffGet<LightningListDto>(endpoint, { params });
  const items = response.data.data.map((item) => ({
    id: item.lightningId,
    restaurantName: item.restaurantName,
    description: item.description,
    maxParticipants: item.maxParticipants,
    participantsCount: item.participantsCount,
    lightningStatus: item.lightningStatus,
    unreadCount: item.unreadCount,
    dateLabel: formatLightningDateLabel(
      item.lightningDate ?? item.lightningData ?? ""
    ),
  }));

  return {
    ...response,
    data: {
      items,
      nextCursor: response.data.hasNext ? response.data.nextCursor : null,
    },
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

export async function getLightningRecommendation(
  x: string,
  y: string,
  config?: import("axios").AxiosRequestConfig
): Promise<ApiResponse<Restaurant>> {
  const response = await bffGet<LightningRecommendationResponse>(
    "/lightning/recommendation",
    { params: { x, y }, ...config }
  );
  return {
    ...response,
    data: mapRecommendation(response.data),
  };
}

export async function createLightning(
  data: CreateLightningRequest
): Promise<ApiResponse<number>> {
  return bffPost<number>("/lightning", data);
}

export async function joinLightning(
  lightningId: string
): Promise<ApiResponse<string>> {
  return bffPost<string>(`/lightning/${lightningId}/users/me`);
}

export async function leaveLightning(
  lightningId: string
): Promise<ApiResponse<void>> {
  return bffDelete<void>(`/lightning/${lightningId}/users/me`);
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
