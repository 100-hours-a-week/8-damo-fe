"use client";

import dynamic from "next/dynamic";

interface LazyKakaoMapViewProps {
  location: {
    lat: number;
    lng: number;
  };
  level?: number;
  className?: string;
  fallbackClassName?: string;
}

const DynamicKakaoMapView = dynamic(
  () =>
    import("@/src/components/ui/kakao-map-view").then(
      (module) => module.KakaoMapView
    ),
  {
    ssr: false,
    loading: () => <div className="h-full w-full animate-pulse bg-muted" />,
  }
);

export function LazyKakaoMapView({
  location,
  level,
  className,
  fallbackClassName,
}: LazyKakaoMapViewProps) {
  return (
    <div className={fallbackClassName}>
      <DynamicKakaoMapView
        location={location}
        level={level}
        className={className}
      />
    </div>
  );
}
