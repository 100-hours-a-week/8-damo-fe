import { AttendanceVotingSection } from "@/src/components/dining/attendance-voting/attendance-voting-section";
import { CompletedSection } from "@/src/components/dining/completed/completed-section";
import { ConfirmedSection } from "@/src/components/dining/confirmed/confirmed-section";
import { RecommendationPendingSection } from "@/src/components/dining/recommendation-pending/recommendation-pending-section";
import { RestaurantVotingSection } from "@/src/components/dining/restaurant-vote/restaurant-voting-section";
import {
  getDiningAttendanceVoteServer,
  getDiningConfirmedServer,
  getDiningRestaurantVoteServer,
} from "@/src/lib/api/server/dining";
import type { DiningCommonResponse } from "@/src/types/api/dining";

interface DiningStatusSectionServerProps {
  groupId: string;
  diningId: string;
  diningCommon: DiningCommonResponse;
}

export async function DiningStatusSectionServer({
  groupId,
  diningId,
  diningCommon,
}: DiningStatusSectionServerProps) {
  switch (diningCommon.diningStatus) {
    case "ATTENDANCE_VOTING": {
      const attendance = await getDiningAttendanceVoteServer({ groupId, diningId });

      return (
        <AttendanceVotingSection
          progress={{
            totalCount: attendance.totalGroupMemberCount,
            voteCount: attendance.completedVoteCount,
          }}
          myVoteStatus={attendance.attendanceVoteStatus}
        />
      );
    }

    case "RECOMMENDATION_PENDING":
      return <RecommendationPendingSection groupId={groupId} diningId={diningId} />;

    case "RESTAURANT_VOTING": {
      const restaurants = await getDiningRestaurantVoteServer({ groupId, diningId });

      return (
        <RestaurantVotingSection
          restaurants={restaurants}
          isGroupLeader={diningCommon.isGroupLeader}
          canAdditionalAttend={false}
        />
      );
    }

    case "CONFIRMED": {
      const confirmedRestaurant = await getDiningConfirmedServer({ groupId, diningId });

      return (
        <ConfirmedSection
          restaurant={confirmedRestaurant}
          fallbackDescription="다시 시도해주세요"
          isGroupLeader={diningCommon.isGroupLeader}
          receiptHref={`/groups/${groupId}/dining/${diningId}/receipt`}
        />
      );
    }

    case "COMPLETE":
      return <CompletedSection />;

    default:
      return null;
  }
}
