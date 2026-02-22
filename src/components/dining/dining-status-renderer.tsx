import {
  AttendanceVotingContainer,
  ConfirmedContainer,
  RecommendationPendingSection,
  RestaurantVotingContainer,
} from "@/src/components/dining";
import { DiningCommonResponse } from "@/src/types/api/dining";

interface DiningStatusRendererProps {
  groupId: string;
  diningId: string;
  diningCommon: DiningCommonResponse;
}

export function DiningStatusRenderer({
  groupId,
  diningId,
  diningCommon,
}: DiningStatusRendererProps) {
  switch (diningCommon.diningStatus) {
    case "ATTENDANCE_VOTING":
      return (
        <AttendanceVotingContainer
          groupId={groupId}
          diningId={diningId}
          diningCommon={diningCommon}
        />
      );

    case "RESTAURANT_VOTING":
      return (
        <RestaurantVotingContainer
          groupId={groupId}
          diningId={diningId}
          diningCommon={diningCommon}
        />
      );

    case "CONFIRMED":
      return (
        <ConfirmedContainer
          groupId={groupId}
          diningId={diningId}
        />
      );

    case "RECOMMENDATION_PENDING":
      return <RecommendationPendingSection />;

    default:
      return null;
  }
}