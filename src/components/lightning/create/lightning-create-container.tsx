"use client";

import { useMemo, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

import { LocationPermissionGate } from "./location-permission-gate";
import { LightningCreateActionBar } from "./lightning-create-action-bar";
import { LightningCapacityInput } from "./lightning-capacity-input";
import { LightningDescriptionInput } from "./lightning-description-input";
import { RecommendedRestaurantLoading } from "./recommended-restaurant-loading";
import { RecommendedRestaurantSection } from "./recommended-restaurant-section";
import {
  LightningDateTimeField,
  type LightningCreateFormValues,
} from "./lightning-date-time-field";

import { useLightningRestaurant } from "@/src/hooks/lightning/create/use-lightning-restaurant";
import { useLightningDescription } from "@/src/hooks/lightning/create/use-lightning-description";

import { formatDateToMinute } from "@/src/lib/utils";
import { useCreateLightning } from "@/src/hooks/lightning/create/use-create-lightning";

export function LightningCreateContainer() {
  const router = useRouter();

  const {
    permission,
    isInitializing,
    restaurant,
    isLoadingRestaurant,
    isTimedOut,
    requestRestaurant,
    retryRestaurant,
  } = useLightningRestaurant();

  const {
    description,
    descriptionCount,
    maxLength,
    setNormalizedDescription,
  } = useLightningDescription();

  const createMutation = useCreateLightning();

  const [maxParticipants, setMaxParticipants] = useState(2);

  const {
    control,
    handleSubmit: rhfHandleSubmit,
    formState: { isValid: isDateValid },
  } = useForm<LightningCreateFormValues>({
    mode: "onChange",
  });

  const disabled = useMemo(() => {
    return (
      permission !== "granted" ||
      description.length === 0 ||
      !isDateValid ||
      !restaurant
    );
  }, [permission, description, isDateValid, restaurant]);

  const shouldBypassPermissionGate =
    isInitializing || (permission !== "denied" && isLoadingRestaurant);

  const handleSubmit = rhfHandleSubmit(async (formData) => {
    if (disabled) return;

    try {
      await createMutation.mutateAsync({
        restaurantId: restaurant?.id ?? "",
        maxParticipants,
        description,
        lightningDate: formatDateToMinute(formData.lightningDate),
      });

      toast.success("번개가 생성되었습니다.");

      router.push("/lightning");
    } catch (error: unknown) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.errorMessage ??
          "번개 생성에 실패했습니다.";

        toast.error(message);
      } else {
        toast.error("번개 생성에 실패했습니다.");
      }
    }
  });

  return (
    <form
      onSubmit={handleSubmit}
      className="flex min-h-[calc(100dvh-56px)] flex-1 flex-col bg-background"
    >
      <div className="flex-1 space-y-4 px-4 pb-6 pt-4">
        <LocationPermissionGate
          permission={permission}
          isInitializing={shouldBypassPermissionGate}
          onRequestPermission={requestRestaurant}
        >
          {isLoadingRestaurant ? (
            <RecommendedRestaurantLoading />
          ) : (
            <RecommendedRestaurantSection
              restaurant={restaurant}
              onRetry={isTimedOut || !restaurant ? retryRestaurant : undefined}
            />
          )}

          <LightningDescriptionInput
            value={description}
            count={descriptionCount}
            maxLength={maxLength}
            onChange={setNormalizedDescription}
          />

          <LightningDateTimeField name="lightningDate" control={control} />

          <LightningCapacityInput
            value={maxParticipants}
            onChange={setMaxParticipants}
          />
        </LocationPermissionGate>
      </div>

      <LightningCreateActionBar
        disabled={disabled}
        isSubmitting={createMutation.isPending}
      />
    </form>
  );
}
