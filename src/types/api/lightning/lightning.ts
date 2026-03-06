import type { LightningStatus } from "@/src/types/lightning";

export interface CreateLightningRequest {
  restaurantId: string; 
  maxParticipants: number;
  description: string; 
  lightningDate: string;
}

export interface LightningDetailParticipantResponse {
  userId: number;
  nickname: string;
  role: string;
}

export interface LightningRecommendationResponse {
  restaurantId: string;
  restaurantName: string;
  x: string;
  y: string;
  phoneNumber: string;
}

export interface LightningDetailResponse {
  lightningId: string;
  restaurantName: string;
  longitude: string;
  latitude: string;
  description: string;
  lightningDate: string;
  maxParticipants: number;
  participantsCount: number;
  lightningStatus: LightningStatus;
  participants: LightningDetailParticipantResponse[];
}