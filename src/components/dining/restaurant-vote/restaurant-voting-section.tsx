"use client"
import type { RestaurantVoteResponse } from "@/src/types/api/dining";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { RestaurantCard } from "./restaurant-card";
import { RestaurantVotingCarousel } from "./restaurant-voting-carousel";
import { RestaurantVoteFallback } from "./restaurant-vote-fallback";
import { RestaurantPermissionAction } from "./restaurant-permission-action";
import { toast } from "@/src/components/ui/sonner";
import { useMemo, useState } from "react";
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
import { confirmRestaurant, refreshRecommendRestaurants } from "@/src/lib/api/client/dining";

interface RestaurantVotingSectionProps {
  restaurants: RestaurantVoteResponse[];
  isGroupLeader: boolean;
  canAdditionalAttend?: boolean;
  onConfirmDining?: (restaurantId: number) => void;
  onRetryRecommendation?: () => void;
  onAdditionalAttend?: () => void;
}

export function RestaurantVotingSection({
  restaurants,
  isGroupLeader,
  canAdditionalAttend = false,
  onConfirmDining,
  onRetryRecommendation,
  onAdditionalAttend,
}: RestaurantVotingSectionProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useParams<{ groupId?: string | string[]; diningId?: string | string[] }>();
  const resolveParam = (value?: string | string[]) =>
    Array.isArray(value) ? value[0] : value;
  const groupId = resolveParam(params?.groupId);
  const diningId = resolveParam(params?.diningId);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRetryingRecommendation, setIsRetryingRecommendation] = useState(false);

  const activeRestaurantId = useMemo(() => {
    if (!restaurants.length) {
      return null;
    }

    const clampedIndex = Math.min(
      Math.max(activeIndex, 0),
      restaurants.length - 1
    );
    return restaurants[clampedIndex].recommendRestaurantsId;
  }, [activeIndex, restaurants]);
  
  if (!restaurants.length) {
    return <RestaurantVoteFallback />;
  }

  const moveToReceiptPage = () => {
    if (!groupId || !diningId) {
      toast.error("경로 정보를 확인할 수 없습니다.");
      return;
    }

    router.push(`/groups/${groupId}/dining/${diningId}/receipt`);
  };

  const handleConfirmDining = (restaurantId: number) => {
    if (onConfirmDining) {
      onConfirmDining(restaurantId);
      return;
    }

    moveToReceiptPage();
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
      onRetryRecommendation?.();
    } catch {
      toast.error("재추천 요청에 실패했습니다.");
    } finally {
      setIsRetryingRecommendation(false);
    }
  };

  const handleAdditionalAttend = () => {
    onAdditionalAttend?.();
  };

  const handleConfirmClick = () => {
    if (isGroupLeader) {
      moveToReceiptPage();
      return;
    }

    setIsDialogOpen(true);
  };

  const handleConfirmSubmit = async () => {
    if (!groupId || !diningId) {
      toast.error("경로 정보를 확인할 수 없습니다.");
      return;
    }

    if (activeRestaurantId === null) {
      toast.error("확정할 식당을 선택할 수 없습니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      await confirmRestaurant({
        groupId,
        diningId,
        recommendRestaurantsId: activeRestaurantId,
      });

      await queryClient.invalidateQueries({
        queryKey: diningRestaurantVoteQueryKey(groupId, diningId),
      });
      toast.success("회식 장소가 확정되었습니다.");
      handleConfirmDining(activeRestaurantId);
    } catch {
      toast.error("회식 장소 확정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
      setIsDialogOpen(false);
    }
  };

  return (
    <section className="flex w-full flex-col items-center gap-4">
      <RestaurantVotingCarousel onIndexChange={setActiveIndex}>
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.recommendRestaurantsId}
            className="flex w-full flex-col items-center"
          >
            <RestaurantCard restaurant={restaurant} />
          </div>
        ))}
      </RestaurantVotingCarousel>
      <div className="w-full px-4 sm:px-5">
        <RestaurantPermissionAction
          isGroupLeader={isGroupLeader}
          canAdditionalAttend={canAdditionalAttend}
          onConfirmDining={handleConfirmClick}
          onRetryRecommendation={handleRetryRecommendation}
          onAdditionalAttend={handleAdditionalAttend}
          isRetryingRecommendation={isRetryingRecommendation}
        />
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
