import { Button } from "@/src/components/ui/button";

interface RestaurantPermissionActionProps {
  isGroupLeader: boolean;
  canAdditionalAttend: boolean;
  onConfirmDining: () => void;
  onRetryRecommendation: () => void;
  onAdditionalAttend: () => void;
  isRetryingRecommendation?: boolean;
  isConfirmDisabled?: boolean;
}

export function RestaurantPermissionAction({
  isGroupLeader,
  canAdditionalAttend,
  onConfirmDining,
  onRetryRecommendation,
  onAdditionalAttend,
  isRetryingRecommendation = false,
  isConfirmDisabled = false,
}: RestaurantPermissionActionProps) {
  return (
    <div className="flex w-full flex-col gap-3">
      {isGroupLeader && (
        <>
          <Button
            type="button"
            onClick={onConfirmDining}
            disabled={isConfirmDisabled}
            className="h-14 w-full rounded-[14px] bg-[#ff8d28] text-white active:bg-[#ff8d28]/90 disabled:opacity-40"
          >
            장소 확정하기
          </Button>
          <Button
            type="button"
            onClick={onRetryRecommendation}
            className="h-14 w-full rounded-[14px] border-2 border-[#d1d5dc] bg-white text-[#101828] hover:bg-gray-50 active:bg-gray-100"
            disabled={isRetryingRecommendation}
          >
            {isRetryingRecommendation ? "추천 다시 받는 중..." : "장소 재추천"}
          </Button>
        </>
      )}
      {canAdditionalAttend && (
        <Button
          type="button"
          variant="secondary"
          onClick={onAdditionalAttend}
          className="h-14 w-full rounded-[14px]"
        >
          추가 참석하기
        </Button>
      )}
    </div>
  );
}
