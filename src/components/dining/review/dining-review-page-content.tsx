import { Header } from "@/src/components/layout";
import { DiningReviewContentField } from "./dining-review-content-field";
import { DiningReviewForm } from "./dining-review-form";
import { DiningReviewRatingField } from "./dining-review-rating-field";
import {
  DiningReviewSatisfactionTagsField,
  type SatisfactionOption,
} from "./dining-review-satisfaction-tags-field";
import { DiningReviewSubmitBar } from "./dining-review-submit-bar";

const SATISFACTION_OPTIONS: SatisfactionOption[] = [
  { value: "DELICIOUS_FOOD", label: "맛있는 음식", iconName: "utensils-crossed" },
  { value: "ENJOYABLE_ATMOSPHERE", label: "즐거운 분위기", iconName: "smile" },
  { value: "KIND_SERVICE", label: "친절한 서비스", iconName: "bell" },
  { value: "OPTIMAL_LOCATION", label: "최적 위치", iconName: "map-pin" },
  { value: "GROUP_COMPATIBILITY", label: "그룹 궁합도", iconName: "users" },
  { value: "DINING_SUCCESS", label: "회식 성공도", iconName: "thumbs-up" },
];

interface DiningReviewPageContentProps {
  groupId: string;
  diningId: string;
}

function RequiredBadge() {
  return (
    <span className="inline-flex h-5 items-center rounded-full bg-[#ff8d28] px-2 text-xs font-medium leading-4 text-white">
      필수
    </span>
  );
}

function OptionalBadge() {
  return (
    <span className="inline-flex h-5 items-center rounded-full bg-[#e5e7eb] px-2 text-xs font-medium leading-4 text-[#4a5565]">
      선택
    </span>
  );
}

export function DiningReviewPageContent({
  groupId,
  diningId,
}: DiningReviewPageContentProps) {
  return (
    <div className="mx-auto flex min-h-dvh w-full min-w-[320px] max-w-[430px] flex-col bg-white">
      <Header title="리뷰하기" className="border-b border-[#f3f4f6] bg-white" backPath={`/groups/${groupId}/dining/${diningId}`} />

      <DiningReviewForm groupId={groupId} diningId={diningId}>
        <div className="flex-1 overflow-y-auto px-6 pb-24">
          <section className="pt-6">
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-lg font-semibold leading-7 tracking-[-0.4395px] text-[#101828]">
                이번 모임은 어떠셨나요?
              </h2>
              <RequiredBadge />
            </div>
            <p className="mt-1 text-center text-xs leading-4 text-[#6a7282]">
              별점을 드래그하여 평가해주세요
            </p>
            <DiningReviewRatingField />
          </section>

          <section className="pt-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold leading-5 tracking-[-0.1504px] text-[#101828]">
                어떤 점이 만족스러웠나요?
              </h3>
              <RequiredBadge />
            </div>
            <DiningReviewSatisfactionTagsField options={SATISFACTION_OPTIONS} />
          </section>

          <section className="pt-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold leading-5 tracking-[-0.1504px] text-[#101828]">
                자세한 후기를 남겨주세요
              </h3>
              <OptionalBadge />
            </div>
            <DiningReviewContentField />
          </section>
        </div>

        <DiningReviewSubmitBar />
      </DiningReviewForm>
    </div>
  );
}
