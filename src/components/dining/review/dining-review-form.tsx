"use client";

import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { type ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { ApiResponse } from "@/src/lib/api/client";
import { createDiningReview } from "@/src/lib/api/client/dining";
import { toast } from "@/src/components/ui/sonner";
import type { CreateDiningReviewRequest } from "@/src/types/api/dining";

interface DiningReviewFormProps {
  children: ReactNode;
  groupId: string;
  diningId: string;
}

export function DiningReviewForm({
  children,
  groupId,
  diningId,
}: DiningReviewFormProps) {
  const router = useRouter();
  const methods = useForm<CreateDiningReviewRequest>({
    mode: "onChange",
    defaultValues: {
      starRating: 0,
      satisfactionTags: [],
      content: "",
    },
  });

  const onSubmit = async (values: CreateDiningReviewRequest) => {
    try {
      const result = await createDiningReview({
        diningId,
        data: {
          starRating: values.starRating,
          satisfactionTags: values.satisfactionTags,
          content: values.content.trim(),
        },
      });

      if (result.errorMessage) {
        throw new Error(result.errorMessage);
      }

      toast.success("리뷰가 등록되었습니다.");
      router.push(`/groups/${groupId}/dining/${diningId}`);
    } catch (error) {
      const message = isAxiosError<ApiResponse<null>>(error)
        ? error.response?.data?.errorMessage ?? "리뷰 등록에 실패했습니다."
        : error instanceof Error
          ? error.message
          : "리뷰 등록에 실패했습니다.";
      toast.error(message);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex min-h-0 flex-1 flex-col"
      >
        {children}
      </form>
    </FormProvider>
  );
}
