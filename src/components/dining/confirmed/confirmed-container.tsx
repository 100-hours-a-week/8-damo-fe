"use client"
import { useDiningConfirmed } from "@/src/hooks/dining/use-dining-confirmed";
import { ConfirmedSection } from "./confirmed-section";
import type { DiningCommonResponse } from "@/src/types/api/dining";

interface ConfirmedContainerProps {
  groupId: string;
  diningId: string;
  diningCommon: DiningCommonResponse;
}

export function ConfirmedContainer({
  groupId,
  diningId,
  diningCommon,
}: ConfirmedContainerProps) {
  const { data } = useDiningConfirmed(groupId, diningId, true);

  return (
    <ConfirmedSection
      restaurant={data ?? null}
      fallbackDescription="다시 시도해주세요"
      isGroupLeader={diningCommon.isGroupLeader}
      receiptHref={`/groups/${groupId}/dining/${diningId}/receipt`}
    />
  );
}
