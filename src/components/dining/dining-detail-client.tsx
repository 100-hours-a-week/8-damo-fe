"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AttendanceVotingSection,
  ConfirmedSection,
  RecommendationPendingSection,
  RestaurantVotingSection,
} from "@/src/components/dining";
import { DiningCommonSection } from "@/src/components/dining/common";
import { DiningErrorToast } from "@/src/components/dining/dining-error-toast";
import type {
  AttendanceVoteResponse,
  ConfirmedRestaurantResponse,
  DiningCommonResponse,
  DiningStatus,
  RestaurantVoteResponse,
} from "@/src/types/api/dining";
import {
  getDiningCommon,
  getDiningAttendanceVote,
  getDiningRestaurantVote,
  getDiningConfirmed
} from "@/src/lib/api/client/dining"

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
  const [attendanceVote, setAttendanceVote] =
    useState<AttendanceVoteResponse | null>(null);
  const [restaurantVotes, setRestaurantVotes] =
    useState<RestaurantVoteResponse[] | null>(null);
  const [confirmedRestaurant, setConfirmedRestaurant] =
    useState<ConfirmedRestaurantResponse | null>(null);

  const lastStatusRef = useRef<DiningStatus>(initialDiningCommon.diningStatus);
  const initializedRef = useRef(false);
 
  const {
    data: diningCommon,
    error: diningCommonError,
  } = useQuery({
    queryKey: ["dining-common", groupId, diningId],
    queryFn: async () => {
      const response = await getDiningCommon({groupId, diningId});
      return response.data;
    },
    initialData: initialDiningCommon,
    refetchInterval: (query) =>
      query.state.data?.diningStatus === "CONFIRMED"
        ? false
        : POLLING_INTERVAL_MS,
    refetchOnWindowFocus: false
  });

  const resetSectionData = () => {
    setAttendanceVote(null);
    setRestaurantVotes(null);
    setConfirmedRestaurant(null);
  };
  
  const fetchSectionData = async (status: DiningStatus) => {
    resetSectionData();

    if (status === "RECOMMENDATION_PENDING") {
      return;
    }

    if (status === "ATTENDANCE_VOTING") {
      try {
        const response = await getDiningAttendanceVote({groupId, diningId});
        setAttendanceVote(response.data);
      } catch (error) {
        console.error("[DiningDetailClient] Failed to load attendance vote", error);
      }
    }

    if (status === "RESTAURANT_VOTING") {
      try {
        const response = await getDiningRestaurantVote({groupId, diningId});
        setRestaurantVotes(response.data);
      } catch (error) {
        console.error("[DiningDetailClient] Failed to load restaurant vote", error);
      }
    }

    if (status === "CONFIRMED") {
      try {
        const response = await getDiningConfirmed({groupId, diningId});
        setConfirmedRestaurant(response.data);
      } catch (error) {
        console.error("[DiningDetailClient] Failed to load confirmed restaurant", error);
      }
    }
  };

  useEffect(() => {
    if (!diningCommon) return;

    const nextStatus = diningCommon.diningStatus;
    const isInitial = !initializedRef.current;
    const isChanged = nextStatus !== lastStatusRef.current;

    if (isInitial || isChanged) {
      lastStatusRef.current = nextStatus;
      initializedRef.current = true;
      queueMicrotask(() => {
        void fetchSectionData(nextStatus);
      });
    }
  }, [diningCommon?.diningStatus]);

  if (!diningCommon) {
    return (
      <>
        {diningCommonError && (
          <DiningErrorToast messages={[diningCommonError.message]}/>
        )}
      </>
    );
  }

  const diningStatus = diningCommon.diningStatus;

  return (
    <DiningCommonSection
      diningDate={diningCommon.diningDate}
      diningStatus={diningStatus}
      diningParticipants={diningCommon.diningParticipants}
      isGroupLeader={diningCommon.isGroupLeader}
    >
      {diningCommonError && (
        <DiningErrorToast messages={[diningCommonError.message]}/>
      )}
      {diningStatus === "ATTENDANCE_VOTING" && attendanceVote && (
        <AttendanceVotingSection
          progress={{
            totalCount: attendanceVote.totalGroupMemberCount,
            voteCount: attendanceVote.completedVoteCount,
          }}
          diningDate={diningCommon.diningDate}
          myVoteStatus={attendanceVote.attendanceVoteStatus}
        />
      )}
      {diningStatus === "RESTAURANT_VOTING" && restaurantVotes && (
        <RestaurantVotingSection
          restaurants={restaurantVotes}
          isGroupLeader={diningCommon.isGroupLeader}
          canAdditionalAttend={false}
        />
      )}
      {diningStatus === "RECOMMENDATION_PENDING" && (
        <RecommendationPendingSection />
      )}
      {diningStatus === "CONFIRMED" && (
        <ConfirmedSection
          restaurant={confirmedRestaurant}
          fallbackDescription="다시 시도해주세요"
        />
      )}
    </DiningCommonSection>
  );
}
