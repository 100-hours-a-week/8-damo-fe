import { bffPost, bffPatch, bffGet, type ApiResponse } from "./index";
import type {
  DiningSummary,
  DiningStatus,
  RestaurantVoteResponse,
  ConfirmedRestaurantResponse,
  DiningCommonResponse,
  AttendanceVoteResponse,
  RecommendationHistoryResponse,
} from "@/src/types/api/dining";

export interface CreateDiningRequest {
  diningDate?: string;
  voteDueDate?: string;
  budget?: number;
}

interface VoteRestaurantData {
  restaurantVoteStatus?: string;
  likeCount?: number;
  dislikeCount?: number;
}

export async function getDiningCommon(params: {
  groupId: string;
  diningId: string;
}): Promise<ApiResponse<DiningCommonResponse>>{
  const {groupId, diningId} = params;
  return bffGet<DiningCommonResponse>(
    `/groups/${groupId}/dining/${diningId}/common`
  );
}

export async function getDiningAttendanceVote(params: {
  groupId: string;
  diningId: string;
}): Promise<ApiResponse<AttendanceVoteResponse>>{
  const {groupId, diningId} = params;
  return bffGet<AttendanceVoteResponse>(
    `/groups/${groupId}/dining/${diningId}/attendance-vote`
  )
}

export async function getDiningRestaurantVote(params: {
  groupId: string;
  diningId: string;
}): Promise<ApiResponse<RestaurantVoteResponse[]>>{
  const {groupId, diningId} = params;
  return bffGet<RestaurantVoteResponse[]>(
    `/groups/${groupId}/dining/${diningId}/restaurant-vote`
  )
}

export async function getDiningConfirmed(params: {
  groupId: string;
  diningId: string;
}): Promise<ApiResponse<ConfirmedRestaurantResponse>>{
  const {groupId, diningId} = params;
  return bffGet<ConfirmedRestaurantResponse>(
    `/groups/${groupId}/dining/${diningId}/confirmed`
  )
}

export async function getDiningRecommendationHistory(params: {
  groupId: string;
  diningId: string;
}): Promise<ApiResponse<RecommendationHistoryResponse>> {
  const { groupId, diningId } = params;
  return bffGet<RecommendationHistoryResponse>(
    `/groups/${groupId}/dining/${diningId}/recommendation-streaming/history`
  );
}

export async function createDining(
  groupId: string,
  data: CreateDiningRequest
): Promise<ApiResponse<number>> {
  return bffPost<number>(`/groups/${groupId}/dining`, data);
}

export async function getGroupDiningSummaries(
  groupId: string,
  status: DiningStatus
): Promise<ApiResponse<DiningSummary[]>> {
  return bffGet<DiningSummary[]>(`/groups/${groupId}/dining`, {
    params: { status },
  });
}

export async function voteAttendance(params: {
  groupId: string;
  diningId: string;
  attendanceVoteStatus: "ATTEND" | "NON_ATTEND";
}): Promise<ApiResponse<void>> {
  const { groupId, diningId, attendanceVoteStatus } = params;
  return bffPatch<void>(
    `/groups/${groupId}/dining/${diningId}/attendance-vote`,
    { attendanceVoteStatus }
  );
}



export async function voteRestaurant(params: {
  groupId: string;
  diningId: string;
  recommendRestaurantsId: number;
  restaurantVoteStatus: "LIKE" | "DISLIKE";
}): Promise<ApiResponse<VoteRestaurantData | string>> {
  const { groupId, diningId, recommendRestaurantsId, restaurantVoteStatus } = params;
  return bffPost<VoteRestaurantData | string>(
    `/groups/${groupId}/dining/${diningId}/restaurants-vote/${recommendRestaurantsId}`,
    { restaurantVoteStatus }
  );
}

export async function refreshRecommendRestaurants(params: {
  groupId: string;
  diningId: string;
}): Promise<ApiResponse<RestaurantVoteResponse[]>> {
  const { groupId, diningId } = params;
  return bffPost<RestaurantVoteResponse[]>(
    `/groups/${groupId}/dining/${diningId}/recommend-restaurants/refresh`
  );
}

export async function confirmRestaurant(params: {
  groupId: string;
  diningId: string;
  recommendRestaurantsId: number;
}): Promise<ApiResponse<ConfirmedRestaurantResponse>> {
  const { groupId, diningId, recommendRestaurantsId } = params;
  return bffPatch<ConfirmedRestaurantResponse>(
    `/groups/${groupId}/dining/${diningId}/recommend-restaurants/${recommendRestaurantsId}/confirmed`
  );
}
