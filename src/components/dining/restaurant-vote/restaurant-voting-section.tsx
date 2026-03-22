"use client"
import { AxiosError } from "axios";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import type { RestaurantVoteResponse } from "@/src/types/api/dining";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { RestaurantCard } from "./restaurant-card";
import { RestaurantVotingCarousel } from "./restaurant-voting-carousel";
import { RestaurantVoteFallback } from "./restaurant-vote-fallback";
import { RestaurantPermissionAction } from "./restaurant-permission-action";
import { toast } from "@/src/components/ui/sonner";
import { diningRestaurantVoteQueryKey } from "@/src/hooks/dining/use-dining-restaurant-vote";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import {
  confirmRestaurant,
  refreshRecommendRestaurants,
  voteRestaurant,
} from "@/src/lib/api/client/dining";

interface RestaurantVotingSectionProps {
  restaurants: RestaurantVoteResponse[];
  isGroupLeader: boolean;
  canAdditionalAttend?: boolean;
  onAdditionalAttend?: () => void;
}

export function RestaurantVotingSection({
  restaurants,
  isGroupLeader,
  canAdditionalAttend = false,
  onAdditionalAttend,
}: RestaurantVotingSectionProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const params = useParams<{ groupId?: string | string[]; diningId?: string | string[] }>();
  const resolveParam = (value?: string | string[]) =>
    Array.isArray(value) ? value[0] : value;
  const groupId = resolveParam(params?.groupId);
  const diningId = resolveParam(params?.diningId);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRetryingRecommendation, setIsRetryingRecommendation] = useState(false);
  const [displayRestaurants, setDisplayRestaurants] = useState(restaurants);
  const [pendingVoteId, setPendingVoteId] = useState<number | null>(null);

  useEffect(() => {
    setDisplayRestaurants(restaurants);
  }, [restaurants]);
  
  if (!displayRestaurants.length) {
    return <RestaurantVoteFallback />;
  }

  const handleRestaurantVoteChange = (
    recommendRestaurantsId: number,
    nextVote: Pick<RestaurantVoteResponse, "restaurantVoteStatus" | "likeCount" | "dislikeCount">
  ) => {
    setDisplayRestaurants((current) =>
      current.map((restaurant) =>
        restaurant.recommendRestaurantsId === recommendRestaurantsId
          ? {
              ...restaurant,
              ...nextVote,
            }
          : restaurant
      )
    );
  };

  const getNextVoteState = (
    currentRestaurant: RestaurantVoteResponse,
    nextStatus: "LIKE" | "DISLIKE"
  ) => {
    const currentStatus =
      currentRestaurant.restaurantVoteStatus === "LIKED"
        ? "LIKE"
        : currentRestaurant.restaurantVoteStatus === "DISLIKED"
        ? "DISLIKE"
        : currentRestaurant.restaurantVoteStatus === "LIKE" ||
          currentRestaurant.restaurantVoteStatus === "DISLIKE"
        ? currentRestaurant.restaurantVoteStatus
        : "NONE";

    if (currentStatus === "NONE") {
      return {
        restaurantVoteStatus: nextStatus,
        likeCount:
          nextStatus === "LIKE"
            ? currentRestaurant.likeCount + 1
            : currentRestaurant.likeCount,
        dislikeCount:
          nextStatus === "DISLIKE"
            ? currentRestaurant.dislikeCount + 1
            : currentRestaurant.dislikeCount,
      } satisfies Pick<
        RestaurantVoteResponse,
        "restaurantVoteStatus" | "likeCount" | "dislikeCount"
      >;
    }

    if (currentStatus === nextStatus) {
      return {
        restaurantVoteStatus: "NONE",
        likeCount:
          nextStatus === "LIKE"
            ? Math.max(0, currentRestaurant.likeCount - 1)
            : currentRestaurant.likeCount,
        dislikeCount:
          nextStatus === "DISLIKE"
            ? Math.max(0, currentRestaurant.dislikeCount - 1)
            : currentRestaurant.dislikeCount,
      } satisfies Pick<
        RestaurantVoteResponse,
        "restaurantVoteStatus" | "likeCount" | "dislikeCount"
      >;
    }

    return {
      restaurantVoteStatus: nextStatus,
      likeCount:
        nextStatus === "LIKE"
          ? currentRestaurant.likeCount + 1
          : Math.max(0, currentRestaurant.likeCount - 1),
      dislikeCount:
        nextStatus === "DISLIKE"
          ? currentRestaurant.dislikeCount + 1
          : Math.max(0, currentRestaurant.dislikeCount - 1),
    } satisfies Pick<
      RestaurantVoteResponse,
      "restaurantVoteStatus" | "likeCount" | "dislikeCount"
    >;
  };

  const handleVoteRestaurant = async (
    recommendRestaurantsId: number,
    nextStatus: "LIKE" | "DISLIKE"
  ) => {
    if (!groupId || !diningId || pendingVoteId !== null) {
      return;
    }

    const currentRestaurant = displayRestaurants.find(
      (restaurant) => restaurant.recommendRestaurantsId === recommendRestaurantsId
    );

    if (!currentRestaurant) {
      return;
    }

    const previousVote = {
      restaurantVoteStatus: currentRestaurant.restaurantVoteStatus,
      likeCount: currentRestaurant.likeCount,
      dislikeCount: currentRestaurant.dislikeCount,
    };
    const optimisticVote = getNextVoteState(currentRestaurant, nextStatus);

    setPendingVoteId(recommendRestaurantsId);
    handleRestaurantVoteChange(recommendRestaurantsId, optimisticVote);

    try {
      const result = await voteRestaurant({
        groupId,
        diningId,
        recommendRestaurantsId,
        restaurantVoteStatus: nextStatus,
      });

      if (
        typeof result.data === "object" &&
        result.data !== null &&
        !Array.isArray(result.data)
      ) {
        handleRestaurantVoteChange(recommendRestaurantsId, {
          restaurantVoteStatus:
            result.data.restaurantVoteStatus === "LIKE"
              ? "LIKE"
              : result.data.restaurantVoteStatus === "DISLIKE"
              ? "DISLIKE"
              : "NONE",
          likeCount:
            typeof result.data.likeCount === "number"
              ? result.data.likeCount
              : optimisticVote.likeCount,
          dislikeCount:
            typeof result.data.dislikeCount === "number"
              ? result.data.dislikeCount
              : optimisticVote.dislikeCount,
        });
      } else if (typeof result.data === "string") {
        handleRestaurantVoteChange(recommendRestaurantsId, {
          ...optimisticVote,
          restaurantVoteStatus:
            result.data === "LIKE"
              ? "LIKE"
              : result.data === "DISLIKE"
              ? "DISLIKE"
              : "NONE",
        });
      }

      await queryClient.invalidateQueries({
        queryKey: diningRestaurantVoteQueryKey(groupId, diningId),
      });
    } catch (error) {
      handleRestaurantVoteChange(recommendRestaurantsId, previousVote);
      const message =
        error instanceof AxiosError
          ? (error.response?.data?.errorMessage ?? "식당 투표에 실패했습니다.")
          : "식당 투표에 실패했습니다.";
      toast.error(message);
    } finally {
      setPendingVoteId(null);
    }
  };

  const handleRetryRecommendation = async () => {
    if (!isGroupLeader) {
      toast.error("그룹장만 재추천 요청이 가능합니다.");
      return;
    }

    if (!groupId || !diningId) {
      toast.error("경로 정보를 확인할 수 없습니다.");
      return;
    }

    if (isRetryingRecommendation) {
      return;
    }

    setIsRetryingRecommendation(true);

    try {
      const result = await refreshRecommendRestaurants({ groupId, diningId });

      if (result.data?.length === 0) {
        window.location.reload();
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: diningRestaurantVoteQueryKey(groupId, diningId),
      });
      await queryClient.invalidateQueries({
        queryKey: ["dining", "detail", groupId, diningId, "common"],
      });
      router.refresh();
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? (error.response?.data?.errorMessage ?? "재추천 요청에 실패했습니다.")
          : "재추천 요청에 실패했습니다.";
      toast.error(message);
    } finally {
      setIsRetryingRecommendation(false);
    }
  };

  const handleAdditionalAttend = () => {
    onAdditionalAttend?.();
  };

  const handleConfirmSubmit = async () => {
    if (!groupId || !diningId) {
      toast.error("경로 정보를 확인할 수 없습니다.");
      return;
    }

    if (selectedId === null) {
      toast.error("확정할 식당을 선택해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      await confirmRestaurant({
        groupId,
        diningId,
        recommendRestaurantsId: selectedId,
      });

      await queryClient.invalidateQueries({
        queryKey: diningRestaurantVoteQueryKey(groupId, diningId),
      });
      await queryClient.invalidateQueries({
        queryKey: ["dining", "detail", groupId, diningId, "common"],
      });
      router.refresh();
      toast.success("회식 장소가 확정되었습니다.");
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? (error.response?.data?.errorMessage ?? "회식 장소 확정에 실패했습니다.")
          : "회식 장소 확정에 실패했습니다.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
      setIsDialogOpen(false);
    }
  };

  return (
    <section className="flex w-full flex-col">
      {/* 투표 현황 */}
      <div className="flex w-full flex-col gap-4 bg-white px-5 pb-6 pt-6">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-lg font-semibold leading-6 text-[#101828]">투표 현황</h3>
          <p className="text-[14px] leading-5 text-[#6a7282]">현재까지 투표 결과입니다</p>
        </div>
        <div className="flex flex-col gap-3">
          {displayRestaurants.map((restaurant) => {
            const isSelected = selectedId === restaurant.recommendRestaurantsId;
            return (
              <button
                key={restaurant.recommendRestaurantsId}
                type="button"
                onClick={() => setSelectedId(isSelected ? null : restaurant.recommendRestaurantsId)}
                className={`flex h-[70px] w-full items-center justify-between rounded-[14px] border px-[17px] transition-colors ${
                  isSelected
                    ? "border-[#ff8d28] bg-[#fff7ed]"
                    : "border-[#e5e7eb] bg-white"
                }`}
              >
                <p className="text-[14px] font-semibold leading-5 text-[#101828]">
                  {restaurant.restaurantsName}
                </p>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="size-4" fill="none" strokeWidth={1.5} />
                    <span className="text-[14px] font-medium leading-5 text-[#0a0a0a]">
                      {restaurant.likeCount}
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsDown className="size-4" fill="none" strokeWidth={1.5} />
                    <span className="text-[14px] font-medium leading-5 text-[#6a7282]">
                      {restaurant.dislikeCount}
                    </span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        <RestaurantPermissionAction
          isGroupLeader={isGroupLeader}
          canAdditionalAttend={canAdditionalAttend}
          onConfirmDining={() => setIsDialogOpen(true)}
          onRetryRecommendation={handleRetryRecommendation}
          onAdditionalAttend={handleAdditionalAttend}
          isRetryingRecommendation={isRetryingRecommendation}
          isConfirmDisabled={selectedId === null}
        />
      </div>

      {/* 식당 카드 캐러셀 */}
      <div className="flex w-full flex-col items-center gap-4 pt-4">
        <RestaurantVotingCarousel>
          {displayRestaurants.map((restaurant) => (
            <div
              key={restaurant.recommendRestaurantsId}
              className="flex w-full flex-col items-center"
            >
              <RestaurantCard
                restaurant={restaurant}
                disabled={pendingVoteId === restaurant.recommendRestaurantsId}
                onLike={() =>
                  handleVoteRestaurant(restaurant.recommendRestaurantsId, "LIKE")
                }
                onDislike={() =>
                  handleVoteRestaurant(restaurant.recommendRestaurantsId, "DISLIKE")
                }
              />
            </div>
          ))}
        </RestaurantVotingCarousel>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>회식 장소를 확정할까요?</DialogTitle>
            <DialogDescription>
              확정 후에는 다른 식당으로 변경할 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="flex-1"
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              type="button"
              onClick={handleConfirmSubmit}
              className="flex-1 bg-[#ff8d28] text-white active:bg-[#ff8d28]/90"
              disabled={isSubmitting}
            >
              확정
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
