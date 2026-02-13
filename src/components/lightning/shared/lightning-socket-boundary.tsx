  "use client";

  import { useSocketLifecycle } from "@/src/lib/websocket/use-socket-lifecycle";

  interface LightningSocketBoundaryProps {
    accessToken: string | null;
    children: React.ReactNode;
  }

  export function LightningSocketBoundary({
    accessToken,
    children,
  }: LightningSocketBoundaryProps) {
    useSocketLifecycle(accessToken);
    return <>{children}</>;
  }