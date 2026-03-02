import { bffGet, bffPost, bffPatch, type ApiResponse } from "./index";
import type { User } from "@/src/stores/user-store";

export async function getMe(): Promise<ApiResponse<User>> {
  return bffGet<User>("/users/me");
}

export interface UpdateBasicInfoRequest {
  imagePath: string;
  nickname: string;
  gender: "MALE" | "FEMALE";
  ageGroup: "TWENTIES" | "THIRTIES" | "FORTIES" | "FIFTIES_PLUS";
}

export async function updateBasicInfo(
  data: UpdateBasicInfoRequest
): Promise<ApiResponse<void>> {
  return bffPatch<void>("/users/me", data);
}

export interface CharacteristicsRequest {
  allergies: string[];
  likeFoods: string[];
  likeIngredients: string[];
  otherCharacteristics: string;
}

export async function updateCharacteristics(
  data: CharacteristicsRequest
): Promise<ApiResponse<void>> {
  return bffPost<void>("/users/me/characteristics", data);
}

export async function editProfile(
  data: CharacteristicsRequest
): Promise<ApiResponse<void>> {
  return bffPatch<void>("/users/me/profile", data);
}

interface CharacteristicItem {
  id: number;
  category: string;
}

interface ProfileData {
  allergies: CharacteristicItem[];
  likeFoods: CharacteristicItem[];
  likeIngredients: CharacteristicItem[];
  otherCharacteristics: string | null;
}

interface PushData {
  fcmToken: string;
  isPushNotificationAllowed: boolean;
}

export async function getMyProfile(): Promise<ApiResponse<ProfileData>> {
  return bffGet<ProfileData>("/users/me/profile");
}

export async function patchPushNotification(data: PushData): Promise<ApiResponse<void>> {
  return bffPatch<void>("/users/me/push-notification", data)
}