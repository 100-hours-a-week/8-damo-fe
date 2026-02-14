import { Button } from "@/src/components/ui/button";
import type { LightningDetail } from "@/src/types/lightning";

import { LightningDetailHeader } from "./lightning-detail-header";
import { LightningDetailMapViewSection } from "./lightning-detail-map-view-section";
import { LightningDetailInfoSection } from "./lightning-detail-info-section";
import { LightningDetailDescriptionSection } from "./lightning-detail-description-section";
import { LightningDetailParticipantListSection } from "./lightning-detail-participant-list-section";

interface LightningDetailPageContentProps {
  detail: LightningDetail;
  canParticipate: boolean;
}

export function LightningDetailPageContent({
  detail,
  canParticipate
}: LightningDetailPageContentProps) {
  const buttonLabel = canParticipate ? "참가하기" : "참가 마감";
  const statusLabel = canParticipate ? "모집 중" : "모집 마감";
  const remainingSeats = Math.max(
    0,
    detail.maxParticipants - detail.currentParticipants
  );

  return (
    <div className="mx-auto flex min-h-dvh w-full min-w-[320px] max-w-[430px] flex-col bg-background">
      <LightningDetailHeader statusLabel={statusLabel} isClosed={!canParticipate} />

      <main className="flex-1 overflow-y-auto px-4 pb-28 pt-4">
        <LightningDetailMapViewSection
          location={detail.location}
          restaurantName={detail.restaurantName}
          meetingDate={detail.meetingDate}
        />

        <LightningDetailInfoSection
          title={detail.title}
          meetingDate={detail.meetingDate}
          restaurantName={detail.restaurantName}
          currentParticipants={detail.currentParticipants}
          maxParticipants={detail.maxParticipants}
        />

        <LightningDetailDescriptionSection description={detail.description}/>

        <LightningDetailParticipantListSection 
          maxParticipants={detail.maxParticipants}
          currentParticipants={detail.currentParticipants}
          participants={detail.participants}
        />

      </main>

      <div className="sticky bottom-0 px-4 py-3 backdrop-blur">
        <Button
          disabled={!canParticipate}
          className="h-12 w-full rounded-2xl text-base font-semibold shadow-sm disabled:opacity-50"
        >
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
}
