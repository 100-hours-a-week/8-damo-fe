export type LightningTab = "recruiting" | "joined";

export type LocationPermission = "unknown" | "granted" | "denied";

export type LightningStatus = "OPEN" | "CLOSED" | "DONE" | string;

export interface LightningItem {
  id: string;
  restaurantName: string;
  description: string;
  maxParticipants: number;
  participantsCount: number;
  dateLabel: string;
  lightningStatus?: LightningStatus;
}

export interface LightningParticipant {
  id: string;
  nickname: string;
  avatarUrl?: string | null;
  role?: string;
}

export interface LightningDetail {
  id: string;
  title: string;
  meetingDate: string;
  restaurantName: string;
  currentParticipants: number;
  maxParticipants: number;
  description: string;
  lightningStatus?: LightningStatus;
  location: {
    lat: number;
    lng: number;
  };
  participants: LightningParticipant[];
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  phoneNumber: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface LightningCreateState {
  locationPermission: LocationPermission;
  restaurant: Restaurant | null;
  description: string;
  maxParticipants: number;
}