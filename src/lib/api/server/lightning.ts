import "server-only";
import { serverGet } from "./index";
import type { LightningItem } from "@/src/types/lightning";
import { formatLightningDateLabel } from "@/src/lib/utils";

interface MyLightningResponse {
  lightningId: string;
  restaurantName: string;
  description: string;
  maxParticipants: number;
  participantsCount: number;
  lightningStatus?: string;
  lightningDate?: string;
  lightningData?: string;
}

function mapLightningItems(data: MyLightningResponse[]): LightningItem[] {
  return data.map((lightning) => ({
    id: lightning.lightningId,
    restaurantName: lightning.restaurantName,
    description: lightning.description,
    maxParticipants: lightning.maxParticipants,
    participantsCount: lightning.participantsCount,
    dateLabel: formatLightningDateLabel(
      lightning.lightningDate ?? lightning.lightningData ?? ""
    ),
  }));
}

export async function getRecruitingLightnings(): Promise<LightningItem[]> {
  const data = await serverGet<MyLightningResponse[]>(
    "/api/v1/users/me/lightning/available"
  );

  return mapLightningItems(data);
}

export async function getJoinedLightnings(): Promise<LightningItem[]> {
  const data = await serverGet<MyLightningResponse[]>("/api/v1/users/me/lightning");

  return mapLightningItems(data);
}