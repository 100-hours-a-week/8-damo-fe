  "use client";

  import { useEffect } from "react";
  import { socketManager } from "@/src/lib/websocket/socket-manager";

  export function useSocketLifecycle(accessToken: string | null) {
    useEffect(() => {
      if (!accessToken) {
        socketManager.disconnect();
        return;
      }

      socketManager.connect(accessToken);

      return () => {
        socketManager.disconnect();
      };
    }, [accessToken]);
  }