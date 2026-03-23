"use client";

import { useFormState } from "react-hook-form";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

export function DiningReviewSubmitBar() {
  const { isSubmitting, isValid } = useFormState();

  return (
    <div className="border-t border-[#e5e7eb] bg-white px-5 pb-5 pt-[21px]">
      <Button
        type="submit"
        disabled={!isValid || isSubmitting}
        className={cn(
          "h-14 w-full rounded-[14px] text-base font-medium text-white disabled:opacity-100",
          !isValid || isSubmitting
            ? "bg-[#d1d5dc] hover:bg-[#d1d5dc]"
            : "bg-[#ff8d28] hover:bg-[#ff8d28]/90 active:bg-[#ff8d28]/90"
        )}
      >
        {isSubmitting ? "등록 중..." : "후기 남기기"}
      </Button>
    </div>
  );
}
