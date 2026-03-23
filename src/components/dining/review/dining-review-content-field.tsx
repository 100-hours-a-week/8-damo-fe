"use client";

import { useController, useFormContext } from "react-hook-form";
import { Textarea } from "@/src/components/ui/textarea";
import type { CreateDiningReviewRequest } from "@/src/types/api/dining";

const MAX_CONTENT_LENGTH = 200;

export function DiningReviewContentField() {
  const { control } = useFormContext<CreateDiningReviewRequest>();
  const {
    field,
  } = useController({
    control,
    name: "content",
    rules: { maxLength: MAX_CONTENT_LENGTH },
  });

  return (
    <>
      <Textarea
        {...field}
        value={field.value ?? ""}
        maxLength={MAX_CONTENT_LENGTH}
        placeholder="좋았던 점을 자유롭게 남겨주세요"
        className="mt-3 h-24 resize-none rounded-[14px] border-0 bg-[#f9fafb] px-3 py-3 text-sm text-[#364153] shadow-none placeholder:text-[#99a1af] focus-visible:ring-0"
      />

      <p className="mt-2 text-right text-xs leading-4 text-[#99a1af]">
        {(field.value ?? "").length}/{MAX_CONTENT_LENGTH}
      </p>
    </>
  );
}
