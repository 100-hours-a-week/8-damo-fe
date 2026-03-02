"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { RestaurantInfo } from "./restaurant-info";
import { RestaurantAction } from "./restaurant-action";
import { voteRestaurant } from "@/src/lib/api/client/dining";
import { toast } from "@/src/components/ui/sonner";
import { diningRestaurantVoteQueryKey } from "@/src/hooks/dining/use-dining-restaurant-vote";
import type {
  ConfirmedRestaurantResponse,
  RestaurantVoteResponse,
} from "@/src/types/api/dining";

interface RestaurantCardProps {
  restaurant: RestaurantVoteResponse | ConfirmedRestaurantResponse;
  showActions?: boolean;
  badgeLabel?: string;
}

export function RestaurantCard({
  restaurant,
  showActions = true,
  badgeLabel,
}: RestaurantCardProps) {
  const params = useParams<{ groupId?: string | string[]; diningId?: string | string[] }>();
  const queryClient = useQueryClient();
  const resolveParam = (value?: string | string[]) =>
    Array.isArray(value) ? value[0] : value;
  const groupId = resolveParam(params?.groupId);
  const diningId = resolveParam(params?.diningId);

  const isVoteRestaurant = "restaurantVoteStatus" in restaurant;
  const initialStatus = isVoteRestaurant ? restaurant.restaurantVoteStatus : "NONE";
  const normalizedStatus =
    initialStatus === "LIKED"
      ? "LIKE"
      : initialStatus === "DISLIKED"
      ? "DISLIKE"
      : initialStatus === "LIKE" || initialStatus === "DISLIKE"
      ? initialStatus
      : "NONE";

  const [voteStatus, setVoteStatus] = useState<
    "LIKE" | "DISLIKE" | "NONE"
  >(normalizedStatus);
  const [likeCount, setLikeCount] = useState(
    "likeCount" in restaurant ? restaurant.likeCount : 0
  );
  const [dislikeCount, setDislikeCount] = useState(
    "dislikeCount" in restaurant ? restaurant.dislikeCount : 0
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLiked = voteStatus === "LIKE";
  const isDisliked = voteStatus === "DISLIKE";

  const location = {
    lat: Number(restaurant.latitude),
    lng: Number(restaurant.longitude),
  };

  const applyLocalVote = (nextStatus: "LIKE" | "DISLIKE") => {
    if (voteStatus === "NONE") {
      if (nextStatus === "LIKE") {
        setLikeCount((count) => count + 1);
      } else {
        setDislikeCount((count) => count + 1);
      }
      setVoteStatus(nextStatus);
      return;
    }

    if (voteStatus === nextStatus) {
      if (nextStatus === "LIKE") {
        setLikeCount((count) => Math.max(0, count - 1));
      } else {
        setDislikeCount((count) => Math.max(0, count - 1));
      }
      setVoteStatus("NONE");
      return;
    }

    if (nextStatus === "LIKE") {
      setLikeCount((count) => count + 1);
      setDislikeCount((count) => Math.max(0, count - 1));
    } else {
      setDislikeCount((count) => count + 1);
      setLikeCount((count) => Math.max(0, count - 1));
    }
    setVoteStatus(nextStatus);
  };

  const syncServerVote = (data?: {
    restaurantVoteStatus?: string;
    likeCount?: number;
    dislikeCount?: number;
  }) => {
    if (!data) {
      return;
    }

    if (typeof data.likeCount === "number") {
      setLikeCount(data.likeCount);
    }
    if (typeof data.dislikeCount === "number") {
      setDislikeCount(data.dislikeCount);
    }
    if (data.restaurantVoteStatus === "LIKE") {
      setVoteStatus("LIKE");
    } else if (data.restaurantVoteStatus === "DISLIKE") {
      setVoteStatus("DISLIKE");
    } else if (data.restaurantVoteStatus === "NONE") {
      setVoteStatus("NONE");
    }
  };

  const submitVote = async (nextStatus: "LIKE" | "DISLIKE") => {
    if (!groupId || !diningId || isSubmitting) {
      return;
    }

    const prevStatus = voteStatus;
    const prevLike = likeCount;
    const prevDislike = dislikeCount;

    setIsSubmitting(true);
    applyLocalVote(nextStatus);

    try {
      const result = await voteRestaurant({
        groupId,
        diningId,
        recommendRestaurantsId: restaurant.recommendRestaurantsId,
        restaurantVoteStatus: nextStatus,
      });

      if (
        typeof result.data === "object" &&
        result.data !== null &&
        !Array.isArray(result.data)
      ) {
        syncServerVote(result.data);
      } else if (typeof result.data === "string") {
        syncServerVote({ restaurantVoteStatus: result.data });
      }

      if (groupId && diningId) {
        await queryClient.invalidateQueries({
          queryKey: diningRestaurantVoteQueryKey(groupId, diningId),
        });
      }
    } catch {
      setVoteStatus(prevStatus);
      setLikeCount(prevLike);
      setDislikeCount(prevDislike);
      toast.error("식당 투표에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full max-w-[390px] flex-col gap-4">
      <div className="w-full rounded-[20px] border border-[#e2e8f0] bg-white px-4 pb-4 pt-5 sm:pt-6">
        <RestaurantInfo
          location={location}
          name={restaurant.restaurantsName}
          description={restaurant.reasoningDescription}
          phoneNumber={restaurant.phoneNumber}
          badgeLabel={badgeLabel}
        />

        {showActions && (
          <div className="mt-3.5 flex w-full items-center justify-end text-black sm:mt-4">
            <RestaurantAction
              likeCount={likeCount}
              dislikeCount={dislikeCount}
              isLiked={isLiked}
              isDisliked={isDisliked}
              disabled={isSubmitting}
              onLike={() => submitVote("LIKE")}
              onDislike={() => submitVote("DISLIKE")}
            />
          </div>
        )}
      </div>

    </div>
  );
}
