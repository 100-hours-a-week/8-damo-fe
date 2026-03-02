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
import { RecommendedRestaurantSection } from "./recommended-restaurant-section";
import { LightningDateTimeField, type LightningCreateFormValues } from "./lightning-date-time-field";

import { useLightningLocation } from "@/src/hooks/lightning/create/use-lightning-location";
import { useLightningDescription } from "@/src/hooks/lightning/create/use-lightning-description";

import { MOCK_RECOMMENDED_RESTAURANTS } from "../mock/mock-recommended-restaurant";
import { createLightning } from "@/src/lib/api/client/lightning";
import { formatDateToMinute } from "@/src/lib/utils";

export function LightningCreateContainer() {
  const router = useRouter();

  const { permission, requestPermission } = useLightningLocation();
  const {
    description,
    descriptionCount,
    maxLength,
    setNormalizedDescription,
  } = useLightningDescription();

  const [maxParticipants, setMaxParticipants] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit: rhfHandleSubmit, formState: { isValid: isDateValid } } = useForm<LightningCreateFormValues>({
    mode: "onChange",
  });

  const disabled = useMemo(() => {
    return permission !== "granted" || description.length === 0 || !isDateValid;
  }, [permission, description, isDateValid]);

  const handleSubmit = rhfHandleSubmit(async (formData) => {
    if (disabled) return;

    setIsSubmitting(true);

    try {
      const response = await createLightning({
        restaurantId: "285564029998141440",
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
    } finally {
      setIsSubmitting(false);
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
          onRequestPermission={requestPermission}
        >
          <RecommendedRestaurantSection restaurant={MOCK_RECOMMENDED_RESTAURANTS[0]} />

          <LightningDescriptionInput
            value={description}
            count={descriptionCount}
            maxLength={maxLength}
            onChange={setNormalizedDescription}
          />

          <LightningDateTimeField
            name="lightningDate"
            control={control}
          />

          <LightningCapacityInput
            value={maxParticipants}
            onChange={setMaxParticipants}
          />
        </LocationPermissionGate>
      </div>

      <LightningCreateActionBar disabled={disabled} isSubmitting={isSubmitting} />
    </form>
  );
}
