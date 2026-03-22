"use client";

import { AxiosError } from "axios";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "@/src/components/ui/sonner";
import { Button } from "@/src/components/ui/button";
import { editProfile } from "@/src/lib/api/client/user";
import { AllergySection } from "./sections/allergy-section";
import { FoodTypeSection } from "./sections/food-type-section";
import { IngredientSection } from "./sections/ingredient-section";
import { MemoSection } from "./sections/memo-section";
import type { Allergy, FoodTypes, Ingredient } from "@/src/constants/onboarding-characteristic";

interface FormData {
  allergies: Allergy[];
  likeFoods: FoodTypes[];
  likeIngredients: Ingredient[];
  otherCharacteristics: string;
}

interface EditCharacteristicContainerProps {
  initialData: {
    allergies: string[];
    likeFoods: string[];
    likeIngredients: string[];
    otherCharacteristics: string;
  };
}

export function EditCharacteristicContainer({ initialData }: EditCharacteristicContainerProps) {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { isDirty, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      allergies: initialData.allergies as Allergy[],
      likeFoods: initialData.likeFoods as FoodTypes[],
      likeIngredients: initialData.likeIngredients as Ingredient[],
      otherCharacteristics: initialData.otherCharacteristics,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await editProfile({
        allergies: data.allergies,
        likeFoods: data.likeFoods,
        likeIngredients: data.likeIngredients,
        otherCharacteristics: data.otherCharacteristics,
      });

      toast.success("저장되었습니다");
      router.back();
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? (error.response?.data?.errorMessage ?? "저장에 실패했습니다")
          : "저장에 실패했습니다";
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col">
      <div className="flex-1 space-y-8 px-4 pb-24 pt-4">
        <Controller
          name="allergies"
          control={control}
          render={({ field }) => (
            <AllergySection
              value={field.value}
              onChange={field.onChange}
              disabled={isSubmitting}
            />
          )}
        />

        <Controller
          name="likeFoods"
          control={control}
          render={({ field }) => (
            <FoodTypeSection
              value={field.value}
              onChange={field.onChange}
              disabled={isSubmitting}
            />
          )}
        />

        <Controller
          name="likeIngredients"
          control={control}
          render={({ field }) => (
            <IngredientSection
              value={field.value}
              onChange={field.onChange}
              disabled={isSubmitting}
            />
          )}
        />

        <Controller
          name="otherCharacteristics"
          control={control}
          render={({ field }) => (
            <MemoSection
              value={field.value}
              onChange={field.onChange}
              disabled={isSubmitting}
            />
          )}
        />
      </div>

      <div className="sticky w-full inset-x-0 bottom-0 bg-background p-4">
        <Button
          type="submit"
          className="w-full"
          disabled={!isDirty || isSubmitting}
        >
          {isSubmitting ? "저장 중..." : "저장"}
        </Button>
      </div>
    </form>
  );
}
