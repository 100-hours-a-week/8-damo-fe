import { formatLightningDateLabel } from "@/src/lib/utils";
import type { LightningDetail } from "@/src/types/lightning";
import { bffGet, bffPost, type ApiResponse } from "./index";
import type { 
  CreateLightningRequest,
  LightningDetailResponse
 } from "@/src/types/api/lightning";


function toCoordinate(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
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
      lat: toCoordinate(raw.latitude),
      lng: toCoordinate(raw.longitude),
    },
    participants: raw.participants.map((participant) => ({
      id: String(participant.userId),
      nickname: participant.nickname,
      role: participant.role,
      avatarUrl: null,
    })),
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
): Promise<ApiResponse<number>>{
  return bffPost<number>("/lightning", data)
}