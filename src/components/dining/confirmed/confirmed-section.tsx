"use client";

import { Receipt } from "lucide-react";
import Link from "next/link";
import { RestaurantCard } from "../restaurant-vote/restaurant-card";
import { ConfirmedFallback } from "./confirmed-fallback";
import type { ConfirmedRestaurantResponse } from "@/src/types/api/dining";

interface ConfirmedSectionProps {
  restaurant: ConfirmedRestaurantResponse | null;
  fallbackDescription: string;
  isGroupLeader: boolean;
  receiptHref?: string;
}

export function ConfirmedSection({
  restaurant,
  fallbackDescription,
  isGroupLeader,
  receiptHref,
}: ConfirmedSectionProps) {
  if (!restaurant) {
    return (
      <section className="flex w-full flex-col items-center gap-4 px-4 sm:px-5">
        <ConfirmedFallback description={fallbackDescription} />
      </section>
    );
  }

  return (
    <section className="flex w-full flex-col gap-4 px-4 sm:px-5">
      <h2 className="text-lg font-bold leading-6 text-[#101828]">확정된 회식 장소</h2>
      <RestaurantCard restaurant={restaurant} showActions={false} />
      {isGroupLeader && receiptHref && (
        <div className="flex flex-col items-center gap-3">
          <Link
            href={receiptHref}
            className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-primary py-4 text-base font-semibold text-white"
          >
            <Receipt className="size-5" />
            영수증 제출하기
          </Link>
          <p className="text-xs text-[#6b7280]">영수증 제출 후 리뷰를 작성할 수 있습니다</p>
        </div>
      )}
    </section>
  );
}
