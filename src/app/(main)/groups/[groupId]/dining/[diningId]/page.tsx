import { Suspense } from "react";
import { DiningCommonSection } from "@/src/components/dining/common";
import { DiningErrorToast } from "@/src/components/dining/dining-error-toast";
import { DiningStatusSectionFallback } from "@/src/components/dining/dining-status-section-fallback";
import { DiningStatusSectionServer } from "@/src/components/dining/dining-status-section-server";
import { getDiningCommon } from "@/src/lib/api/server/dining";
import type { DiningCommonResponse } from "@/src/types/api/dining";

interface DiningDetailPageProps {
  params: Promise<{
    groupId: string;
    diningId: string;
  }>;
}

export default async function DiningDetailPage({
  params,
}: DiningDetailPageProps) {
  const { groupId, diningId } = await params;

  const errorMessages: string[] = [];
  const fallbackErrorMessage = "요청 중 오류가 발생했습니다.";

  let diningCommon: DiningCommonResponse | null = null;

  try {
    diningCommon = await getDiningCommon({ groupId, diningId });
  } catch (error) {
    errorMessages.push(
      error instanceof Error ? error.message : fallbackErrorMessage
    );
  }

  if (!diningCommon) {
    return (
      <>
        {errorMessages.length > 0 && (
          <DiningErrorToast messages={errorMessages} />
        )}
      </>
    );
  }
  return (
    <DiningCommonSection
      diningDate={diningCommon.diningDate}
      diningStatus={diningCommon.diningStatus}
      diningParticipants={diningCommon.diningParticipants}
      isGroupLeader={diningCommon.isGroupLeader}
      backPath={`/groups/${groupId}`}
    >
      {errorMessages.length > 0 && (
        <DiningErrorToast messages={errorMessages} />
      )}

      <Suspense fallback={<DiningStatusSectionFallback />}>
        <DiningStatusSectionServer
          groupId={groupId}
          diningId={diningId}
          diningCommon={diningCommon}
        />
      </Suspense>
    </DiningCommonSection>
  );
}
