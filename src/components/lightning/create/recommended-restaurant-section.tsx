import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { KakaoMapView } from "@/src/components/ui/kakao-map-view";
import type { Restaurant } from "@/src/types/lightning";
import { Phone } from "lucide-react";

interface RecommendedRestaurantSectionProps {
  restaurant: Restaurant | null;
  onRetry?: () => void;
}

export function RecommendedRestaurantSection({
  restaurant,
  onRetry,
}: RecommendedRestaurantSectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-[#444444]">추천 식당</h2>

      {restaurant ? (
        <>
          <article className="rounded-2xl border border-[#d1d1d6] bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-lg font-bold leading-7 text-[#111111]">{restaurant.name}</p>
                <p className="mt-1 text-sm text-[#666666]">{restaurant.description}</p>
                <a href={`tel:${restaurant.phoneNumber}`}
                className="flex items-center gap-2 text-[14px] font-medium leading-5 text-[#2563eb] sm:text-[15px] sm:leading-[22px]">
                <Phone className="size-4" />
                <span>{restaurant.phoneNumber}</span>
          </a>
              </div>
              <Badge variant="default" size="sm" className="shrink-0">
                추천 식당
              </Badge>
            </div>
          </article>

          <div className="overflow-hidden rounded-2xl border border-[#d1d1d6] bg-white">
            <KakaoMapView
              location={{
                lat: restaurant.location?.lat,
                lng: restaurant.location?.lng
              }}
              className="h-52 w-full"
            />
          </div>
        </>
      ) : (
        <div className="flex h-52 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[#d1d1d6] bg-[#f8f8fa] px-4 text-center text-sm text-muted-foreground">
          <span>추천 식당 정보를 불러올 수 없습니다.</span>
          {onRetry && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="rounded-xl"
            >
              다시 시도
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
