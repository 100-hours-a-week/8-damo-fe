"use client";

import { startTransition, useEffect, useReducer } from "react";
import { DiningCommonSection } from "@/src/components/dining/common";
import { DiningErrorToast } from "@/src/components/dining/dining-error-toast";
import type { DiningCommonResponse } from "@/src/types/api/dining";
import { useDiningCommon } from "@/src/hooks/dining/use-dining-common";
import {
  diningDetailReducer,
  mapDiningStatusToState,
} from "./dining-detail.reducer";
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
  const [diningState, dispatch] = useReducer(
    diningDetailReducer,
    initialDiningCommon.diningStatus,
    mapDiningStatusToState
  );
  const serverDiningStatus = diningCommon?.diningStatus;

  useEffect(() => {
    if (!serverDiningStatus) {
      return;
    }

    if (mapDiningStatusToState(serverDiningStatus).type === diningState.type) {
      return;
    }

    startTransition(() => {
      dispatch({
        type: "SYNC_FROM_SERVER",
        diningStatus: serverDiningStatus,
      });
    });
  }, [diningState.type, serverDiningStatus]);

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
        diningState={diningState}
      />
    </DiningCommonSection>
  );
}
