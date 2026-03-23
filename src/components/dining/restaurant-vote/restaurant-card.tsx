"use client";

import { RestaurantInfo } from "./restaurant-info";
import { RestaurantAction } from "./restaurant-action";
import type {
  ConfirmedRestaurantResponse,
  RestaurantVoteResponse,
} from "@/src/types/api/dining";

interface RestaurantCardProps {
  restaurant: RestaurantVoteResponse | ConfirmedRestaurantResponse;
  showActions?: boolean;
  badgeLabel?: string;
  onLike?: () => void;
  onDislike?: () => void;
  disabled?: boolean;
}

export function RestaurantCard({
  restaurant,
  showActions = true,
  badgeLabel,
  onLike,
  onDislike,
  disabled = false,
}: RestaurantCardProps) {
  const isVoteRestaurant = "restaurantVoteStatus" in restaurant;
  const initialStatus = isVoteRestaurant ? restaurant.restaurantVoteStatus : "NONE";
  const voteStatus =
    initialStatus === "LIKED"
      ? "LIKE"
      : initialStatus === "DISLIKED"
      ? "DISLIKE"
      : initialStatus === "LIKE" || initialStatus === "DISLIKE"
      ? initialStatus
      : "NONE";
  const likeCount = "likeCount" in restaurant ? restaurant.likeCount : 0;
  const dislikeCount = "dislikeCount" in restaurant ? restaurant.dislikeCount : 0;

  const isLiked = voteStatus === "LIKE";
  const isDisliked = voteStatus === "DISLIKE";

  const location = {
    lat: Number(restaurant.latitude),
    lng: Number(restaurant.longitude),
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
          <div className="mt-3.5 flex w-full items-center sm:mt-4">
            <RestaurantAction
              likeCount={likeCount}
              dislikeCount={dislikeCount}
              isLiked={isLiked}
              isDisliked={isDisliked}
              disabled={disabled}
              onLike={onLike ?? (() => {})}
              onDislike={onDislike ?? (() => {})}
            />
          </div>
        )}
      </div>

    </div>
  );
}
