"use client";

import { DiningCommonSection } from "@/src/components/dining/common";
import { DiningErrorToast } from "@/src/components/dining/dining-error-toast";
import type { DiningCommonResponse } from "@/src/types/api/dining";
import { useDiningCommon } from "@/src/hooks/dining/use-dining-common";
import { DiningStatusRenderer } from "./dining-status-renderer";

interface DiningDetailClientProps {
  groupId: string;
  diningId: string;
  initialDiningCommon: DiningCommonResponse;
}

export function DiningDetailClient({
  groupId,
  diningId,
  initialDiningCommon,
}: DiningDetailClientProps) {

  const {
    data: diningCommon,
    error: diningCommonError,
  } = useDiningCommon(groupId, diningId, initialDiningCommon);

  if (!diningCommon) return null;

  return (
    <DiningCommonSection
      diningDate={diningCommon.diningDate}
      diningStatus={diningCommon.diningStatus}
      diningParticipants={diningCommon.diningParticipants}
      isGroupLeader={diningCommon.isGroupLeader}
    >
      {diningCommonError && (
        <DiningErrorToast messages={[diningCommonError.message]} />
      )}

      <DiningStatusRenderer
        groupId={groupId}
        diningId={diningId}
        diningCommon={diningCommon}
      />
    </DiningCommonSection>
  );
}
