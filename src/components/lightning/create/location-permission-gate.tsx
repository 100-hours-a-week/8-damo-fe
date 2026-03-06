import type { ReactNode } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import type { LocationPermission } from "@/src/types/lightning";

interface LocationPermissionGateProps {
  permission: LocationPermission;
  isInitializing: boolean;
  onRequestPermission: () => void;
  children: ReactNode;
}

export function LocationPermissionGate({
  permission,
  isInitializing,
  onRequestPermission,
  children,
}: LocationPermissionGateProps) {
  if (isInitializing || permission === "granted") {
    return <>{children}</>;
  }

  if (permission === "denied") {
    return (
      <section className="rounded-2xl border border-[#d1d1d6] bg-white p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-primary p-2">
            <MapPin className="size-4 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-semibold text-[#111111]">위치 권한이 필요해요</h2>
            <p className="mt-1 text-sm leading-5 text-[#666666]">
              브라우저 설정에서 위치 권한을 허용한 뒤 페이지를 새로고침해주세요.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[#d1d1d6] bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-primary p-2">
          <MapPin className="size-4 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-semibold text-[#111111]">내 주변 식당을 먼저 불러올게요</h2>
          <p className="mt-1 text-sm leading-5 text-[#666666]">
            버튼을 누르면 현재 위치를 확인해 주변 추천 식당을 찾아드립니다.
          </p>
        </div>
      </div>

      <Button
        type="button"
        onClick={onRequestPermission}
        className="mt-4 h-11 w-full rounded-xl"
      >
        내 주변 식당 불러오기
      </Button>
    </section>
  );
}
