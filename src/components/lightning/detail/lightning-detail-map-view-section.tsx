import { LazyKakaoMapView } from "@/src/components/ui/lazy-kakao-map-view";
import { SectionCard } from "@/src/components/ui/section-card";
import { LightningDetail } from "@/src/types/lightning";

interface LightningDetailMapViewSectionProps {
  location: LightningDetail["location"];
  restaurantName: string;
  meetingDate: string;
}

export function LightningDetailMapViewSection({
  location,
  restaurantName,
  meetingDate,
}: LightningDetailMapViewSectionProps) {
  return (
    <SectionCard spacing="compact" className="overflow-hidden p-0">
      <div className="relative">
        <LazyKakaoMapView
          location={location}
          className="h-52 w-full"
          fallbackClassName="h-52 w-full"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent px-4 pb-3 pt-10 text-white">
          <p className="truncate text-sm font-semibold leading-5">{restaurantName}</p>
          <p className="mt-0.5 text-xs font-medium text-white/85">{meetingDate}</p>
        </div>
      </div>
    </SectionCard>
  );
}
