import {
  AttendanceVotingContainer,
  ConfirmedContainer,
  RecommendationPendingSection,
  RestaurantVotingContainer,
} from "@/src/components/dining";
import { CompletedSection } from "@/src/components/dining/completed/completed-section";
import { DiningCommonResponse } from "@/src/types/api/dining";
import type { DiningState } from "./dining-detail.reducer";

interface DiningStatusRendererProps {
  groupId: string;
  diningId: string;
  diningCommon: DiningCommonResponse;
  diningState: DiningState;
}

export function DiningStatusRenderer({
  groupId,
  diningId,
  diningCommon,
  diningState,
}: DiningStatusRendererProps) {
  switch (diningState.type) {
    case "attendance-voting":
      return (
        <AttendanceVotingContainer
          groupId={groupId}
          diningId={diningId}
          diningCommon={diningCommon}
        />
      );

    case "recommendation-pending":
      return (
        <RecommendationPendingSection
          groupId={groupId}
          diningId={diningId}
        />
      );

    case "restaurant-voting":
      return (
        <RestaurantVotingContainer
          groupId={groupId}
          diningId={diningId}
          diningCommon={diningCommon}
        />
      );

    case "confirmed":
      return (
        <ConfirmedContainer
          groupId={groupId}
          diningId={diningId}
          diningCommon={diningCommon}
        />
      );

    case "completed":
      return <CompletedSection />;

    default:
      return null;
  }
}
