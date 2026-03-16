import { Header } from "@/src/components/layout/header";
import { Badge } from "@/src/components/ui/badge";

interface LightningDetailHeaderProps {
  statusLabel: string;
  isClosed: boolean;
}

export function LightningDetailHeader({
  statusLabel,
  isClosed,
}: LightningDetailHeaderProps) {
  return (
    <Header
      title="모임 정보"
      showBackButton={true}
      backPath="/lightning"
      className="bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75"
      rightElement={
        <Badge
          variant={isClosed ? "error" : "warning"}
          size="sm"
          className="min-w-[64px] px-2.5 text-[11px] font-semibold"
        >
          {statusLabel}
        </Badge>
      }
    />
  );
}
