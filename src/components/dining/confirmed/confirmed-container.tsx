"use client"
import { useDiningConfirmed } from "@/src/hooks/dining/use-dining-confirmed";
import { ConfirmedSection } from "./confirmed-section";

interface ConfirmedContainerProps {
  groupId: string;
  diningId: string;
}

export function ConfirmedContainer({
  groupId,
  diningId,
}: ConfirmedContainerProps) {

  const { data } = useDiningConfirmed(
    groupId,
    diningId,
    true
  );

  return (
    <ConfirmedSection
      restaurant={data ?? null}
      fallbackDescription="다시 시도해주세요"
    />
  );
}