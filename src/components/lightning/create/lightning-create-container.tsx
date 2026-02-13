"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { LocationPermissionGate } from "./location-permission-gate";
import { LightningCreateActionBar } from "./lightning-create-action-bar";
import { LightningCapacityInput } from "./lightning-capacity-input";
import { LightningDescriptionInput } from "./lightning-description-input";
import { RecommendedRestaurantSection } from "./recommended-restaurant-section";

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

  const disabled = useMemo(() => {
    return permission !== "granted" || description.length === 0;
  }, [permission, description]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (disabled) return;

    setIsSubmitting(true);

    try{
      await createLightning({
        restaurantId: "1", 
        maxParticipants, 
        description, 
        lightningDate: formatDateToMinute(new Date())
      });
      toast.success("번개가 생성되었습니다.");
      router.push("/lightning");
    } catch (error) {
      console.error(error);
      toast.error("번개 생성에 실패했습니다.");
    } finally{
      setIsSubmitting(false);
    }
  };

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
