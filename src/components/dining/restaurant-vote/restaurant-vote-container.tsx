"use client"

import { DiningCommonResponse } from "@/src/types/api/dining";
import { useDiningRestaurantVote } from "@/src/hooks/dining/use-dining-restaurant-vote";
import { RestaurantVotingSection } from "./restaurant-voting-section";

interface RestaurantVotingContainerProps {
  groupId: string;
  diningId: string;
  diningCommon: DiningCommonResponse;
}

export function RestaurantVotingContainer({
  groupId,
  diningId,
  diningCommon,
}: RestaurantVotingContainerProps) {

  const { data } = useDiningRestaurantVote(
    groupId,
    diningId,
    true
  );

  if (!data) return null;

  return (
    <RestaurantVotingSection
      restaurants={data}
      isGroupLeader={diningCommon.isGroupLeader}
      canAdditionalAttend={false}
    />
  );
}