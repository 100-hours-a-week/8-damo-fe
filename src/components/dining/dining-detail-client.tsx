"use client";

import { useQuery } from "@tanstack/react-query";
import {
  AttendanceVotingSection,
  ConfirmedSection,
  RecommendationPendingSection,
  RestaurantVotingSection,
} from "@/src/components/dining";
import { DiningCommonSection } from "@/src/components/dining/common";
import { DiningErrorToast } from "@/src/components/dining/dining-error-toast";
import type { DiningCommonResponse } from "@/src/types/api/dining";
import {
  getDiningAttendanceVote,
  getDiningCommon,
  getDiningConfirmed,
  getDiningRestaurantVote,
} from "@/src/lib/api/client/dining";

const POLLING_INTERVAL_MS = 5_000;

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
  } = useQuery({
    queryKey: ["dining", "detail", groupId, diningId, "common"],
    queryFn: async () => {
      const response = await getDiningCommon({ groupId, diningId });
      return response.data;
    },
    initialData: initialDiningCommon,
    refetchInterval: POLLING_INTERVAL_MS,
    refetchOnWindowFocus: false,
  });

  const diningStatus = diningCommon?.diningStatus;
  const isAttendanceVoting = diningStatus === "ATTENDANCE_VOTING";
  const isRestaurantVoting = diningStatus === "RESTAURANT_VOTING";
  const isConfirmed = diningStatus === "CONFIRMED";

  const { data: attendanceVote } = useQuery({
    queryKey: ["dining", "detail", groupId, diningId, "attendance-vote"],
    queryFn: async () => {
      const response = await getDiningAttendanceVote({ groupId, diningId });
      return response.data;
    },
    enabled: isAttendanceVoting,
    refetchInterval: POLLING_INTERVAL_MS,
    refetchOnWindowFocus: false,
  });

  const { data: restaurantVotes } = useQuery({
    queryKey: ["dining", "detail", groupId, diningId, "restaurant-vote"],
    queryFn: async () => {
      const response = await getDiningRestaurantVote({ groupId, diningId });
      return response.data;
    },
    enabled: isRestaurantVoting,
    refetchInterval: POLLING_INTERVAL_MS,
    refetchOnWindowFocus: false,
  });

  const { data: confirmedRestaurant } = useQuery({
    queryKey: ["dining", "detail", groupId, diningId, "confirmed"],
    queryFn: async () => {
      const response = await getDiningConfirmed({ groupId, diningId });
      return response.data;
    },
    enabled: isConfirmed,
    refetchInterval: POLLING_INTERVAL_MS,
    refetchOnWindowFocus: false,
  });

  if (!diningCommon) {
    return (
      <>
        {diningCommonError && (
          <DiningErrorToast messages={[diningCommonError.message]} />
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
    >
      {diningCommonError && (
        <DiningErrorToast messages={[diningCommonError.message]} />
      )}
      {diningCommon.diningStatus === "ATTENDANCE_VOTING" && attendanceVote && (
        <AttendanceVotingSection
          progress={{
            totalCount: attendanceVote.totalGroupMemberCount,
            voteCount: attendanceVote.completedVoteCount,
          }}
          diningDate={diningCommon.diningDate}
          myVoteStatus={attendanceVote.attendanceVoteStatus}
        />
      )}
      {diningCommon.diningStatus === "RESTAURANT_VOTING" && restaurantVotes && (
        <RestaurantVotingSection
          restaurants={restaurantVotes}
          isGroupLeader={diningCommon.isGroupLeader}
          canAdditionalAttend={false}
        />
      )}
      {diningCommon.diningStatus === "RECOMMENDATION_PENDING" && (
        <RecommendationPendingSection />
      )}
      {diningCommon.diningStatus === "CONFIRMED" && (
        <ConfirmedSection
          restaurant={confirmedRestaurant ?? null}
          fallbackDescription="다시 시도해주세요"
        />
      )}
    </DiningCommonSection>
  );
}
