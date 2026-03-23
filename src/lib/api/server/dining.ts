import "server-only";
import { serverGet } from "./index";
import type {
  AttendanceVoteResponse,
  ConfirmedRestaurantResponse,
  DiningCommonResponse,
  DiningStatus,
  DiningSummary,
  RecommendationHistoryResponse,
  RestaurantVoteResponse,
} from "@/src/types/api/dining";

export async function getDiningCommon(params: {
  groupId: string;
  diningId: string;
}): Promise<DiningCommonResponse> {
  const { groupId, diningId } = params;
  return serverGet<DiningCommonResponse>(
    `/api/v1/groups/${groupId}/dining/${diningId}`
  );
}

export async function getGroupDiningSummaries(
  groupId: string,
  status: DiningStatus
): Promise<DiningSummary[]> {
  return serverGet<DiningSummary[]>(`/api/v1/groups/${groupId}/dining`, {
    params: { status },
  });
}

export async function getDiningRecommendationHistory(params: {
  groupId: string;
  diningId: string;
}): Promise<RecommendationHistoryResponse> {
  const { groupId, diningId } = params;
  return serverGet<RecommendationHistoryResponse>(
    `/api/v1/groups/${groupId}/dining/${diningId}/recommendation-streaming/history`
  );
}

export async function getDiningAttendanceVoteServer(params: {
  groupId: string;
  diningId: string;
}): Promise<AttendanceVoteResponse> {
  const { groupId, diningId } = params;
  return serverGet<AttendanceVoteResponse>(
    `/api/v1/groups/${groupId}/dining/${diningId}/attendance-vote`
  );
}

export async function getDiningRestaurantVoteServer(params: {
  groupId: string;
  diningId: string;
}): Promise<RestaurantVoteResponse[]> {
  const { groupId, diningId } = params;
  return serverGet<RestaurantVoteResponse[]>(
    `/api/v1/groups/${groupId}/dining/${diningId}/restaurant-vote`
  );
}

export async function getDiningConfirmedServer(params: {
  groupId: string;
  diningId: string;
}): Promise<ConfirmedRestaurantResponse> {
  const { groupId, diningId } = params;
  return serverGet<ConfirmedRestaurantResponse>(
    `/api/v1/groups/${groupId}/dining/${diningId}/confirmed`
  );
}
