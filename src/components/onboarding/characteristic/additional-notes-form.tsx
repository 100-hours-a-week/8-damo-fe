"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/src/components/ui/button";
import { AdditionalNotesField } from "./additional-notes-field";
import {
  additionalNotesSchema,
  type AdditionalNotesFormValues,
} from "@/src/lib/schema/characteristic";
import { useOnboardingStore } from "@/src/stores/onboarding-store";
import { updateCharacteristics } from "@/src/lib/api/client/user";
import { toast } from "@/src/components/ui/sonner";
import { useCompleteOnboarding } from "@/src/hooks/use-complete-onboarding";

export function AdditionalNotesForm() {
  const { advanceToNextStep } = useCompleteOnboarding();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { additionalNotes, setAdditionalNotes, getCharacteristics } =
    useOnboardingStore();

  const { control, handleSubmit, formState: { isValid } } = useForm<AdditionalNotesFormValues>({
    resolver: zodResolver(additionalNotesSchema),
    mode: "onChange",
    defaultValues: {
      additionalNotes,
    },
  });

  const onSubmit = async (data: AdditionalNotesFormValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    setAdditionalNotes(data.additionalNotes);
    const characteristics = getCharacteristics();

    try {
      await updateCharacteristics({
        allergies: characteristics.allergies,
        likeFoods: characteristics.foodTypes,
        likeIngredients: characteristics.ingredients,
        otherCharacteristics: data.additionalNotes,
      });

      const advanced = await advanceToNextStep("DONE");
      if (!advanced) {
        setIsSubmitting(false);
        return;
      }
    } catch {
      toast.error("재접속을 시도해주세요.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col">
      <Controller
        name="additionalNotes"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <AdditionalNotesField
            value={field.value}
            onChange={field.onChange}
            showLabel={false}
            error={error?.message}
          />
        )}
      />

      <div className="mt-auto pt-8">
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="h-16 w-full rounded-lg bg-primary text-base font-semibold text-white shadow-md hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? "처리중..." : "완료"}
        </Button>
      </div>
    </form>
  );
}
