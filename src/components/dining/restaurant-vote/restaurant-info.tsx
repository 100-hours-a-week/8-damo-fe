"use client";

import { Check, Phone } from "lucide-react";
import { LazyKakaoMapView } from "@/src/components/ui/lazy-kakao-map-view";

interface RestaurantInfoProps {
  location: {
    lat: number;
    lng: number;
  };
  name: string;
  description?: string;
  phoneNumber?: string;
  badgeLabel?: string;
}

export function RestaurantInfo({
  location,
  name,
  description,
  phoneNumber,
  badgeLabel,
}: RestaurantInfoProps) {
  return (
    <section className="flex w-full flex-col gap-2.5 sm:gap-3">
      <div className="w-full overflow-hidden rounded-[12px]">
        <LazyKakaoMapView
          location={location}
          className="h-36 w-full sm:h-40"
          fallbackClassName="h-36 w-full sm:h-40"
        />
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <h2 className="text-base font-semibold leading-6 text-[#1f2937] sm:text-[17px]">
            {name}
          </h2>
          {badgeLabel && (
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-primary px-2.5 py-1 text-[11px] font-medium leading-[14px] text-primary-foreground">
              <Check className="size-3" />
              {badgeLabel}
            </span>
          )}
        </div>
        {description && (
          <p className="text-[14px] leading-5 text-[#6b7280] sm:text-[15px] sm:leading-[22px]">
            {description}
          </p>
        )}
        {phoneNumber && (
          <a
            href={`tel:${phoneNumber}`}
            className="flex items-center gap-2 text-[14px] font-medium leading-5 text-[#2563eb] sm:text-[15px] sm:leading-[22px]"
          >
            <Phone className="size-4" />
            <span>{phoneNumber}</span>
          </a>
        )}
      </div>
    </section>
  );
}
