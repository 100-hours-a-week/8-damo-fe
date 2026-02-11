export type LightningTab = "recruiting" | "joined";

export type LocationPermission = "unknown" | "granted" | "denied";

export interface LightningItem {
  id: string;
  restaurantName: string;
  description: string;
  maxParticipants: number;
  participantsCount: number;
  dateLabel: string;
}

export interface LightningParticipant {
  id: string;
  nickname: string;
  avatarUrl?: string | null;
}

export interface LightningDetail {
  id: string;
  title: string;
  meetingDate: string;
  restaurantName: string;
  currentParticipants: number;
  maxParticipants: number;
  description: string;
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
