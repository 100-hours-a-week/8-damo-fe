import "server-only";
import { serverGet } from "./index";
import type {
  DiningCommonResponse,
  DiningSummary,
  DiningStatus,
  RecommendationHistoryResponse,
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
